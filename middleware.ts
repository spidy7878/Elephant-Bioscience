import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Protect /products, /productListing, /test routes
  const protectedRoutes = ["/products", "/productListing/*", "/test"];
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected) {
    // Check for JWT in cookies (localStorage is not available in middleware)
    const jwt = request.cookies.get("strapi_jwt");
    if (!jwt) {
      // Redirect to home page if not authenticated
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*", "/productListing/:path*", "/test/:path*"],
};
