---
title: Preferred color schemes on the server with HTTP client hint headers
description: Dynamic, themeable apps can create a great user experience, but we should aim to respect the user's system preferences first.
createdAt: Mar 14 2022 18:00:00
---

<aside>

**Important:** The API below is a draft spec. It is an early proposal and is currently only implemented in newer versions of Chrome. I don't recommend using this strategy just yet, but it's interesting and worth paying attention to!

</aside>

Today I discovered a proposal for a useful feature for server-rendered websites and apps. Last year the W3C published a [draft spec for user preference client hint headers](https://wicg.github.io/user-preference-media-features-headers/) that would provide some information to web servers when a user visits a page. These headers would tell the server if the device from which the request originated has preferences for things like reduced motion, color contrast, or color scheme. These headers are designed to align with [CSS user preference media queries](https://www.w3.org/TR/mediaqueries-5/#mf-user-preferences).

Since browsers started supporting these media queries, app developers were able to do a lot more to provide better experiences for users with different needs. But there are some cases that CSS can't handle alone, and allowing the server to send back a tailored response based on the user's settings will come in quite handy.

Consider the increasingly popular dark/light mode toggle. Users may set a color scheme preference in their device's OS settings that can affect how a page appears given a `prefers-color-scheme` media query. But a toggle on your website will indicate a preference specifically for that site. For this case you will need to use JavaScript to handle the preferred theme.

There are a few ways to go about it, but if your app is server-rendered it would be useful to know the initial state as soon as the response comes in to initialize your theme directly in the server-rendered DOM and avoid any flashing. This has been a long-standing headache, particularly when working with JavaScript frameworks that require hydration for server-rendering, and the initial server-rendered page flashes the wrong theme before scripts have time to make the change. [Workarounds exist](https://github.com/donavon/use-dark-mode/blob/develop/noflash.js.txt), but they aren't entirely ergonomic. And sites without JavaScript (or users who disable it) won't be able to render a dark mode for users who prefer it.

Some larger sites may also inline their styles for various reasons, and it would be useful to ship less CSS than is needed. With standard stylesheets one can conditionally request a CSS for dark mode `<link media="(prefers-color-scheme: dark)" />`, but for inline styles you'd want to have this preference from the initial request so you know which styles to ship.

Understanding the various use cases, how does this new HTTP header work, and how would we implement it?

## Server implementation

When a user visits your site, a request is made to your server that will respond with various headers — which are essentially key/value pairs. One such header is `Accept-CH`, `CH` meaning "client hint". When the client receives this response, it will send subsequent requests to the same domain with the necessary client data back to the server[^1]. It doesn't send all client information—only the information explicitly requested with this header.

The initial response would look something like this:

```http
HTTP/2 200 OK
Content-Type: text/html
Accept-CH: Sec-CH-Prefers-Color-Scheme
Critical-CH: Sec-CH-Prefers-Color-Scheme
Vary: Sec-CH-Prefers-Color-Scheme
```

> You may also notice the [`Critical-CH`](https://chromestatus.com/feature/5727177800679424) and [`Vary`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) headers. `Vary` is useful for all client hint headers and negotiates rules for caching, and `Critical-CH`, as the name implies, is useful for when the requested data is critical for returning the correct response. Check the links for more info.

Once the client sees these headers and "agrees" to share the data with the server, the following request will look something like this:

```http
GET / HTTP/2
Host: chance.dev
Sec-CH-Prefers-Color-Scheme: "dark"
```

The implementation of course depends on what kind of server you're running. If you're using Express, the implementation for this strategy might look something like this:

```js
const cookie = require("cookie");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
	// Set headers for the initial response
	res.set("Accept-CH", "Sec-CH-Prefers-Color-Scheme");
	res.set("Critical-CH", "Sec-CH-Prefers-Color-Scheme");
	res.set("Vary", "Sec-CH-Prefers-Color-Scheme");

	// Get the color scheme from the subsequent request
	let colorScheme = req.get("sec-ch-prefers-color-scheme");

	// Perhaps the user overrides the system theme and you store the
	// preference in a cookie
	let cookies = cookie.parse(req.headers.cookie);

	// Send back the HTML adjusted as needed for the correct scheme
	// Prioritize scheme for our app and fallback to system preference
	res.send(renderMarkup(cookies.colorScheme || colorScheme));
});
```

In this case, `renderMarkup` might look something like this:

```js
function renderMarkup(colorScheme) {
	return `
		<!DOCTYPE html>
		<html data-color-scheme="${colorScheme || "system"}>
			${/* draw the rest of the f*cking owl */}
		</html>
	`;
}
```

Now all you need is a little CSS and you have the building blocks for a dynamic, themeable app that respects the user's system preferences until they opt out. All progressively enhanced, no FOUC, no jank, no gross hydration errors.

```css
:root {
	--color-body-text: #000;
	--color-body-background: #fff;
}

:root[data-color-scheme="dark"] {
	--color-body-text: #fff;
	--color-body-background: #000;
}

/**
 * You may still want to query for the preference in CSS. This is a great
 * progressive enhancement in cases where no preference is set on the server
 * but you still want to respect the OS. Remember that user clients can decline
 * to send data requested by headers!
 */
@media (prefers-color-scheme: dark) {
	:root:not([data-color-scheme="light"]) {
		--color-body-text: #fff;
		--color-body-background: #000;
	}
}

html,
body {
	background: var(--color-body-background);
	color: var(--color-body-text);
}
```

Now all we need is for the proposal to formally land and for non-Chrome browsers to implement. But when they do, you'll be ready. 🚀

[^1]: Important to note that not all clients will support the requested hints, and that the client may refuse this data if the user has opted out of sharing
