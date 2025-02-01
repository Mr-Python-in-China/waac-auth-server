import { NextRequest, NextResponse } from "next/server";

export default function middlware(req: NextRequest) {
  const res = NextResponse.next();
  const session = req.cookies.get("session")?.value;
  if (session)
    res.cookies.set("session", session, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60, // 10 days
    });
  return res;
}
