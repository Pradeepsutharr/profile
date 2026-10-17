import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function errorResponse(error) {
  const status = error instanceof ApiError ? error.status : 500;
  const message = error instanceof ApiError ? error.message : "Something went wrong";
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
