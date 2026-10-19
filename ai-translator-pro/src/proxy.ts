// Next.js 16 uses proxy.ts. On Next 15 or older, rename this file to middleware.ts.
import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = { matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"] };
