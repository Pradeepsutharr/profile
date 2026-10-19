import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

function fieldLabel(field) {
  if (!field) return null;
  return String(field)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function prettyField(field) {
  return fieldLabel(field) || "This field";
}

function inferFieldFromPgError(error) {
  if (error?.column) return error.column;
  const constraint = String(error?.constraint || "");
  if (/slug/i.test(constraint)) return "slug";
  if (/email/i.test(constraint)) return "email";

  const haystack = `${error?.message || ""} ${error?.detail || ""} ${error?.where || ""}`;
  const named = haystack.match(
    /\b(featured|published|gallery|metrics|tags|tech_stack|bullets|sort_order|score|start_date|end_date|published_at|is_read|is_starred|status|slug|email|title|name)\b/i,
  );
  if (named) return named[1].toLowerCase();

  const typeMatch = haystack.match(/invalid input syntax for type ([a-z ]+)/i);
  const type = typeMatch?.[1]?.trim().toLowerCase();
  if (!type) return undefined;
  if (type.includes("json")) return "gallery";
  if (type.includes("boolean")) return "featured";
  if (type.includes("smallint") || type === "integer" || type === "bigint")
    return "sort_order";
  if (type.includes("timestamp") || type === "date") return "published_at";
  if (type === "uuid") return "id";
  return undefined;
}

function databaseInputDetails(error) {
  const field = inferFieldFromPgError(error);
  const label = prettyField(field);
  const messageText = String(error?.message || "");
  const invalidValue =
    messageText.match(/invalid input syntax for type [^:]+:\s*"([^"]*)"/i)?.[1] ??
    null;
  const shownValue =
    invalidValue === null || invalidValue === undefined
      ? null
      : invalidValue === ""
        ? "an empty value"
        : `"${invalidValue}"`;

  if (error?.code === "23502")
    return {
      field,
      message: `${label} is required.`,
    };
  if (error?.code === "22001")
    return {
      field,
      message: `${label} is too long. Please shorten it and try again.`,
    };
  if (error?.code === "22007" || error?.code === "22008")
    return {
      field,
      message: `${label} must be a valid date in YYYY-MM-DD format.`,
    };
  if (error?.code === "22P02") {
    const type =
      messageText
        .match(/invalid input syntax for type ([a-z ]+)/i)?.[1]
        ?.trim()
        .toLowerCase() || "";
    if (type.includes("json"))
      return {
        field: field || "gallery",
        message: `${prettyField(field || "gallery")} must be valid JSON. For gallery use a list of image URLs; for metrics use [{"label":"Conversion","value":"+24%"}].`,
      };
    if (type.includes("boolean"))
      return {
        field: field || "featured",
        message: `${prettyField(field || "featured")} must be on or off (true or false).`,
      };
    if (type.includes("smallint") || type === "integer" || type === "bigint")
      return {
        field: field || "sort_order",
        message: `${prettyField(field || "sort_order")} must be a whole number${shownValue ? `, not ${shownValue}` : ""}.`,
      };
    if (type.includes("timestamp") || type === "date")
      return {
        field: field || "published_at",
        message: `${prettyField(field || "published_at")} must be a valid date in YYYY-MM-DD format${shownValue ? `, not ${shownValue}` : ""}.`,
      };
    if (type === "uuid")
      return {
        field: field || "id",
        message: `The record id is invalid${shownValue ? ` (${shownValue})` : ""}. Reload the page and try again.`,
      };
    return {
      field,
      message: shownValue
        ? `${label} has an invalid value (${shownValue}). Check the format for this field and try again.`
        : `${label} has an invalid value. Check the format for this field and try again.`,
    };
  }
  if (error?.code === "23514") {
    if (field === "score")
      return {
        field,
        message: "Score must be a number between 0 and 100.",
      };
    if (field === "status")
      return {
        field,
        message:
          "Status must be one of: new, read, replied, or archived.",
      };
    return {
      field,
      message: `${label} is outside the allowed range or is not a permitted value.`,
    };
  }
  return {
    field,
    message: `${label} could not be saved. Please review this field and try again.`,
  };
}

export function errorResponse(error) {
  const databaseConflict = error?.code === "23505";
  const databaseInputError = [
    "22001",
    "22007",
    "22008",
    "22P02",
    "23502",
    "23514",
  ].includes(error?.code);
  const validationError = error?.name === "ZodError";
  const inputDetails = databaseInputError ? databaseInputDetails(error) : null;
  const status =
    error instanceof ApiError
      ? error.status
      : databaseConflict
        ? 409
        : databaseInputError || validationError
          ? 400
          : 500;
  const zodIssue = validationError ? error.issues?.[0] : null;
  const zodField = zodIssue?.path?.[0];
  const message =
    error instanceof ApiError
      ? error.message
      : databaseConflict
        ? /slug/i.test(error?.constraint || "")
          ? "A record with that slug already exists. Please choose a different slug."
          : /email/i.test(error?.constraint || "")
            ? "That email is already in use. Please use a different email."
            : "A record with that unique value already exists. Please change the highlighted field."
        : validationError
          ? zodField
            ? `${prettyField(zodField)}: ${zodIssue.message}`
            : zodIssue?.message || "Please check the submitted fields."
          : databaseInputError
            ? inputDetails.message
            : "The server could not complete this request. Please try again.";
  const details =
    error instanceof ApiError
      ? error.details
      : databaseConflict
        ? {
            field: /slug/i.test(error?.constraint || "")
              ? "slug"
              : /email/i.test(error?.constraint || "")
                ? "email"
                : undefined,
          }
        : validationError
          ? { field: zodField, issues: error.issues }
          : databaseInputError
            ? { field: inputDetails.field }
            : undefined;
  if (status >= 500) console.error(error);
  return NextResponse.json({ error: message, details }, { status });
}

export async function readJson(request, { allowEmpty = false } = {}) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      throw new ApiError(400, "Request data must be a JSON object.");
    }
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (allowEmpty && error instanceof SyntaxError) return {};
    throw new ApiError(400, "Request data must be valid JSON.");
  }
}

export async function withApi(handler) {
  try {
    return await handler();
  } catch (error) {
    return errorResponse(error);
  }
}
