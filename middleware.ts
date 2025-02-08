import { NextRequest, NextResponse } from "next/server";

const ignoredTrailingSlashRedirectPaths = [/^\/yggdrasil/];

export default function middlware(req: NextRequest) {
  // Redirect to the same path without a trailing slash
  const { pathname } = req.nextUrl;
  if (
    pathname !== "/" &&
    pathname.endsWith("/") &&
    !ignoredTrailingSlashRedirectPaths.some((re) => re.test(pathname))
  ) {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), req.nextUrl),
      308
    );
  }

  const res = NextResponse.next();
  const session = req.cookies.get("session")?.value;
  if (session)
    res.cookies.set("session", session, {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60, // 10 days
    });
  return res;
}
