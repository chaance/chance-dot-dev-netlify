import { renderToString } from "react-dom/server";
import { RemixServer } from "@remix-run/react";
import type { EntryContext } from "@remix-run/node";
import * as minifyHtml from "@minify-html/js";

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

const minifyHtmlConfig = minifyHtml.createConfiguration({
	do_not_minify_doctype: true,
	ensure_spec_compliant_unquoted_attribute_values: true,
	keep_closing_tags: true,
	keep_comments: false,
	keep_html_and_head_opening_tags: true,
	keep_spaces_between_attributes: true,
	minify_css: true,
	minify_js: true,
});

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

	return new Response(
		"<!DOCTYPE html>\n" +
			FUN_ASCII +
			(process.env.NODE_ENV === "production"
				? minifyHtml.minify(markup, minifyHtmlConfig).toString()
				: markup),
		{
			status: responseStatusCode,
			headers: responseHeaders,
		}
	);
}
