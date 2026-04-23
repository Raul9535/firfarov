import { NextResponse, type NextRequest } from "next/server";

/**
 * Expose the request pathname on a request header so Server Components can derive the
 * current locale via `headers().get("x-pathname")`.
 *
 * Note: we forward it via `next({ request: { headers } })`, not `response.headers.set(...)`.
 * `headers()` in Server Components reads the *request* headers — writing to the outgoing
 * response headers doesn't reach the component tree.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
