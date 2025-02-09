import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
    signOut: "/",
  },
});

export const config = {
  matcher: ["/quiz/:path*", "/dashboard"], // Add any protected routes here
};
