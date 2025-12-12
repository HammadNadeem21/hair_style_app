import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/sign_up", // Redirect to sign_up if not authenticated
    },
})

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - sign_in (sign in page)
         * - sign_up (sign up page)
         * - public (public files)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sign_in|sign_up|public).*)",
    ],
}
