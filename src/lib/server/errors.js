import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorResponse(error) {
  const databaseConflict = error?.code === "23505";
  const status = error instanceof ApiError ? error.status : databaseConflict ? 409 : 500;
  const message = error instanceof ApiError ? error.message : databaseConflict ? "A record with that unique value already exists. Please use a different slug or title." : "The server could not complete this request. Please try again.";
  if (status >= 500) console.error(error);
  return NextResponse.json({ error: message, details: error.details }, { status });
}

export async function withApi(handler) {
  try {
    return await handler();
  } catch (error) {
    return errorResponse(error);
  }
}
