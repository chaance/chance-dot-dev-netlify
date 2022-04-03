import { canUseDOM } from "~/lib/utils";

export class FontFaceObserver {
	family: string;
	style: string;
	weight: string;
	stretch: string;

	static DEFAULT_TIMEOUT = 3000;

	constructor(family: string, optDescriptors?: Descriptors) {
		let descriptors = optDescriptors || {};

		this.family = family;
		this.style = descriptors.style || "normal";
		this.weight = descriptors.weight || "normal";
		this.stretch = descriptors.stretch || "normal";
	}

	load(text?: string, timeout?: number) {
		let testString = text || "BESbswy";
		let timeoutId = 0;
		let timeoutValue = timeout || FontFaceObserver.DEFAULT_TIMEOUT;
		let start = this.getTime();

		return new Promise((resolve, reject) => {
			let loader = new Promise<void>((res, rej) => {
				let check = () => {
					let now = this.getTime();
					if (now - start >= timeoutValue) {
						rej(new Error("" + timeoutValue + "ms timeout exceeded"));
					} else {
						document.fonts
							.load(this.getStyle('"' + this.family + '"'), testString)
							.then((fonts) => {
								if (fonts.length >= 1) {
									res();
								} else {
									setTimeout(check, 25);
								}
							}, reject);
					}
				};
				check();
			});
			let timer = new Promise((_, rej) => {
				timeoutId = window.setTimeout(() => {
					rej(Error(`${timeoutValue}ms timeout exceeded`));
				}, timeoutValue);
			});
			Promise.race([timer, loader]).then(() => {
				window.clearTimeout(timeoutId);
				resolve(this);
			}, reject);
		});
	}

	getStyle(family: string) {
		return [this.style, this.weight, this.stretch, "100px", family].join(" ");
	}

	protected getTime() {
		return new Date().getTime();
	}
}

interface ObservedFont {
	font: string;
	status: "idle" | "resolved" | "error";
	error?: any;
}

interface FontsStatus {
	status: "idle" | "resolved" | "resolved-partial" | "error";
	fonts: ObservedFont[];
}

export async function loadFonts(
	fonts: string[],
	opts: { logErrors?: boolean } = {}
): Promise<FontsStatus> {
	if (!canUseDOM) {
		return {
			status: "idle",
			fonts: fonts.map((font) => ({ font, status: "idle" })),
		};
	}
	if (fonts.length === 0) {
		return {
			status: "resolved",
			fonts: [],
		};
	}

	let logErrors = opts.logErrors ?? true;

	let _fonts = fonts.map<Promise<ObservedFont>>(async (fontName) => {
		let observer = new FontFaceObserver(fontName);

		try {
			await observer.load();
			return {
				font: fontName,
				status: "resolved",
			};
		} catch (error) {
			return {
				font: fontName,
				status: "error",
				error,
			};
		}
	});

	let observedFonts = await Promise.all(_fonts);
	let failedFonts: string[] = [];
	for (let { font, status } of observedFonts) {
		if (status === "error") {
			failedFonts.push(font);
		}
	}

	if (failedFonts.length > 0 && logErrors) {
		console.error(
			"There was an error loading some web fonts. Reverting to fallbacks for:\n - " +
				failedFonts.join("\n - ")
		);
	}

	return {
		status:
			failedFonts.length > 0
				? failedFonts.length === observedFonts.length
					? "error"
					: "resolved-partial"
				: "resolved",
		fonts: observedFonts,
	};
}

export type { ObservedFont };

export default FontFaceObserver;

interface Descriptors {
	style?: string;
	weight?: string;
	stretch?: string;
}
