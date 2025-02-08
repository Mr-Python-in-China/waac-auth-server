import { NextResponse } from "next/server";

const NotFound = () => {
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
};
export const GET = NotFound;
export const POST = NotFound;
export const PUT = NotFound;
export const DELETE = NotFound;
export const PATCH = NotFound;
export const OPTIONS = NotFound;
export const HEAD = NotFound;
