export const canUseDOM = Boolean(
	typeof window !== "undefined" &&
		window.document &&
		window.document.createElement
);

export function isFunction(value: any): value is Function {
	return typeof value === "function";
}

export function isObject(
	value: any
): value is { [key in string | number | symbol]: any } {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: any): value is string {
	return typeof value === "string";
}

export function isBoolean(value: any): value is string {
	return typeof value === "boolean";
}

export function documentReady(): Promise<void> {
	if (!canUseDOM) return Promise.resolve();
	if (document.body) return Promise.resolve();

	return new Promise<void>((res) => {
		document.addEventListener("DOMContentLoaded", function listener() {
			document.removeEventListener("DOMContentLoaded", listener);
			res();
		});
	});
}

export function unSlashIt(str: string) {
	return str.replace(/^(\/*)|(\/*)$/g, "");
}

export function leadingSlashIt(str: string) {
	return "/" + unSlashIt(str);
}

export function trailingSlashIt(str: string) {
	return unSlashIt(str) + "/";
}

export function doubleSlashIt(str: string) {
	return "/" + unSlashIt(str) + "/";
}

// https://github.com/sindresorhus/is-absolute-url/blob/main/index.js
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const WINDOWS_PATH_REGEX = /^[a-zA-Z]:\\/;

export function isAbsoluteUrl(url: string) {
	if (WINDOWS_PATH_REGEX.test(url)) {
		return false;
	}

	return ABSOLUTE_URL_REGEX.test(url);
}

export function shallowEqual(x: any, y: any): boolean {
	if (objectIs(x, y)) {
		return true;
	}

	if (
		typeof x !== "object" ||
		x === null ||
		typeof y !== "object" ||
		y === null
	) {
		return false;
	}

	let keysA = Object.keys(x);
	let keysB = Object.keys(y);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	for (let i = 0; i < keysA.length; i++) {
		let currentKey = keysA[i];
		if (
			!Object.prototype.hasOwnProperty.call(y, currentKey) ||
			!objectIs(x[currentKey], y[currentKey])
		) {
			return false;
		}
	}

	return true;
}

export function objectIs(x: any, y: any) {
	if (isFunction(Object.is)) {
		return Object.is(x, y);
	}

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#browser_compatibility
	// SameValue algorithm
	if (x === y) {
		// return true if x and y are not 0, OR
		// if x and y are both 0 of the same sign.
		// This checks for cases 1 and 2 above.
		return x !== 0 || 1 / x === 1 / y;
	} else {
		// return true if both x AND y evaluate to NaN.
		// The only possibility for a variable to not be strictly equal to itself
		// is when that variable evaluates to NaN (example: Number.NaN, 0/0, NaN).
		// This checks for case 3.
		// eslint-disable-next-line no-self-compare
		return x !== x && y !== y;
	}
}

export function findOverflowXCulprit() {
	if (!canUseDOM) return;
	for (let el of document.querySelectorAll("*")) {
		if (
			el instanceof HTMLElement &&
			el.offsetWidth > document.documentElement.offsetWidth
		) {
			console.log(el);
		}
	}
}

export function typedBoolean<T>(
	value: T
): value is Exclude<T, "" | 0 | false | null | undefined> {
	return Boolean(value);
}
