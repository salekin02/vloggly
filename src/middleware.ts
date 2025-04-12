import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");
  const isAuthenticated = request.cookies.get("isAuthenticated");
  const path = request.nextUrl.pathname;

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up");

  const isSignupFlow = request.nextUrl.pathname.startsWith("/sign-up/");
  const isPublicPage = path.startsWith("/public/");

  // Allow public pages without auth
  if (isPublicPage) {
    return NextResponse.next();
  }
  // Allow access to signup flow pages if they have token but not fully authenticated
  if (token && !isAuthenticated && isSignupFlow) {
    return NextResponse.next();
  }

  // Redirect to login if no token or not authenticated
  if ((!token || !isAuthenticated) && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect authenticated users away from auth pages
  if (token && isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
