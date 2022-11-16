import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";

const FUN_ASCII = `
<!--
 ______     ______    ___ __ __    ___    __    __
/_____/\\   /_____/\\  /__//_//_/\\  /__/\\  /__/\\ /__/\\
\\:::::\\ \\  \\:::::\\/_ \\::\\|:\\|:\\ \\ \\::\\ \\ \\::\\ \\\\::\\ \\
 \\:\\_):) )_ \\:\\/___/\\ \\::::::::\\ \\ \\::\\ \\ \\:.\\ \\\\::\\/
  \\:::::\`\\ \\ \\:::::\\/_ \\::\\:/\\::\\ \\ \\::\\ \\  _\\:::.\\_\\/\\
   \\:\\ \`\\:\\ \\ \\:\\/___/\\ \\::\\  \\::\\ \\ \\::\\ \\ \\:.\\ \\\\::\\ \\
    \\:\\/ \\:\\/  \\:::::\\/  \\::\\/ \\::\\/  \\::\\/  \\::\\/ \\::\\/
-->
`;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	let markup = renderToString(
		<RemixServer context={remixContext} url={request.url} />
	);

	responseHeaders.set("Content-Type", "text/html");

	return new Response("<!DOCTYPE html>\n" + FUN_ASCII + markup, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}
