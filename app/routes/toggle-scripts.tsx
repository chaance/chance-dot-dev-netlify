import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { serverSessionStorage } from "~/lib/session.server";
import { isString } from "~/lib/utils";

const ENABLED = "enabled";
const DISABLED = "disabled";
const SESSION_KEY = "scripts";

export const loader: LoaderFunction = async () => {
	return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
	let [session, formData] = await Promise.all([
		serverSessionStorage.getSession(request.headers.get("Cookie")),
		request.formData(),
	]);

	let redirectTo = "/";
	try {
		let _redirect = formData.get("_redirect");
		if (isString(_redirect)) {
			let requestUrl = new URL(request.url);
			let redirectUrl = new URL(_redirect, requestUrl.origin);
			redirectTo = redirectUrl.pathname;
		}
	} catch (_) {}

	let scripts = formData.get("scripts");
	let toggle = formData.get("toggle");
	if (toggle === null) {
		scripts = DISABLED;
	} else if (toggle === "on") {
		scripts = ENABLED;
	}

	if (scripts === ENABLED || scripts === DISABLED) {
		session.set(SESSION_KEY, scripts);
		return redirect(redirectTo, {
			headers: {
				"Set-Cookie": await serverSessionStorage.commitSession(session),
			},
		});
	}
	return redirect(redirectTo, { status: 400 });
};
