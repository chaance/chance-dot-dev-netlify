import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.COOKIE_SECRET) {
	throw new Error("process.env.COOKIE_SECRET is required");
}

export const serverSessionStorage = createCookieSessionStorage({
	cookie: {
		path: "/",
		sameSite: "lax",
		secure: process.env.NODE_ENV !== "development",
		secrets: [process.env.COOKIE_SECRET],
	},
});
