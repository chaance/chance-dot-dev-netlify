import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export let loader: LoaderFunction = async () => {
	return redirect("/blog");
};
