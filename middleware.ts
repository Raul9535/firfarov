import { NextResponse, type NextRequest } from "next/server";

// Expose the request pathname on a header so Server Components (the root layout, in particular)
// can derive the current locale without hitting the URL API.
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
