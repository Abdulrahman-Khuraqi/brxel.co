import { NextResponse } from "next/server";

const SESSION_COOKIE = "brxel_session";
const SESSION_DAYS = 30;

/*
 * Runs before every dashboard request. It only does the cheap, optimistic
 * part: no cookie means straight to the sign-in page, and a present cookie is
 * re-issued so an active session keeps sliding forward. Whether the session
 * is real, and what the user may do, is checked on the server by every page
 * and action (src/server/auth/guard.js).
 */
export function proxy(request) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isLogin = pathname.startsWith("/admin/login");

  if (!token && !isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login/";
    url.search = pathname === "/admin/" || pathname === "/admin" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  if (token && !isLogin) {
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
