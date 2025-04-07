import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export default auth((req) => {
  const headersList = new Headers(headers());
  headersList.append("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({
    headers: headersList
  })
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
