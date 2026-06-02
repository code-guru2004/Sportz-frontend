// middleware.js
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
];

function getUserRoleFromToken(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    return payload.role;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  // console.log("pathname:", pathname);
  // console.log("access:", request.cookies.get("accessToken")?.value);
  // console.log("refresh:", request.cookies.get("refreshToken")?.value);
  const userRole = getUserRoleFromToken(accessToken);

  // Public routes
  if (publicRoutes.includes(pathname)) {
    // Has valid access token → redirect to dashboard
    if (accessToken && userRole) {
      return NextResponse.redirect(
        new URL(`/${userRole.toLowerCase()}/dashboard`, request.url)
      );
    }
  
    // No access token but refresh exists
    // Allow page so AuthContext can refresh and redirect
    if (!accessToken && refreshToken) {
      return NextResponse.next();
    }
  
    return NextResponse.next();
  }

  // No auth at all
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  /**
   * IMPORTANT:
   * Refresh token exists but access token expired.
   * Allow request so AuthContext can refresh it.
   */
  if (!accessToken && refreshToken) {
    return NextResponse.next();
  }

  // Protected dashboard redirect
  if (pathname === "/dashboard" && userRole) {
    return NextResponse.redirect(
      new URL(`/${userRole.toLowerCase()}/dashboard`, request.url)
    );
  }

  // Role protection
  if (userRole) {
    const role = userRole.toLowerCase();

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(
        new URL(`/${role}/dashboard`, request.url)
      );
    }

    if (pathname.startsWith("/coach") && role !== "coach") {
      return NextResponse.redirect(
        new URL(`/${role}/dashboard`, request.url)
      );
    }

    if (pathname.startsWith("/athlete") && role !== "athlete") {
      return NextResponse.redirect(
        new URL(`/${role}/dashboard`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};