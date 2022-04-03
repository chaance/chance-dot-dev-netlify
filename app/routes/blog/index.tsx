import { LoaderFunction, redirect } from "remix";

export let loader: LoaderFunction = async ({ params }) => {
	return redirect("/");
};
