import { auth } from "@/lib/auth";

const publicRoutes = [""];
const authRoutes = ["/sign-in"];

export default auth((req) => {
  if (req.auth?.user && authRoutes.includes(req.nextUrl.pathname)) {
    return Response.redirect(new URL("/", req.url));
  }

  if (
    !req.auth?.user &&
    !publicRoutes.includes(req.nextUrl.pathname) &&
    !authRoutes.includes(req.nextUrl.pathname)
  ) {
    return Response.redirect(new URL("/sign-in", req.url));
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
