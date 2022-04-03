import { createCookieSessionStorage } from "remix";

export const unencryptedStorage = createCookieSessionStorage({
	cookie: {
		path: "/",
		sameSite: "lax",
		secrets: ["s3cret1"],
	},
});
