What is ClerkMiddleware in Next.js?
ClerkMiddleware is a special middleware function provided by Clerk that works with Next.js middleware to:

✅ Protect your routes
✅ Automatically redirect unauthenticated users to sign-in
✅ Inject user info into requests

🧩 Why Middleware?
Middleware in Next.js (in the App Router) lets you intercept requests before they hit your page.

Clerk uses this to:

Check if a user is signed in

Redirect them if not

Pass along session data for server-side checks