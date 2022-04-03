import { renderToString } from "react-dom/server";
import { RemixServer } from "remix";
import type { EntryContext } from "remix";

const FUN_ASCII = `
<!--
 ______    ______   ___ __ __    ________  __     __
/_____/\\  /_____/\\ /__//_//_/\\  /_______/\\/__/\\ /__/\\
\\:::_ \\ \\ \\::::_\\/_\\::\\| \\| \\ \\ \\__.::._\\/\\ \\::\\\\:.\\ \\
 \\:(_) ) )_\\:\\/___/\\\\:.      \\ \\   \\::\\ \\  \\_\\::_\\:_\\/
  \\: __ \`\\ \\\\::___\\/_\\:.\\-/\\  \\ \\  _\\::\\ \\__ _\\/__\\_\\_/\\
   \\ \\ \`\\ \\ \\\\:\\____/\\\\. \\  \\  \\ \\/__\\::\\__/\\\\ \\ \\ \\::\\ \\
    \\_\\/ \\_\\/ \\_____\\/ \\__\\/ \\__\\/\\________\\/ \\_\\/  \\__\\/
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
