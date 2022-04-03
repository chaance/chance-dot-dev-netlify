const defaultTheme = require("tailwindcss/defaultTheme");
const tailWindColors = require("tailwindcss/colors");

const colorPalette = {
	transparent: "transparent",
	current: "currentColor",
	black: tailWindColors.black,
	white: tailWindColors.white,

	amber: tailWindColors.amber,
	blue: {
		50: "#EAF6FF",
		100: "#D7EEFF",
		150: "#D7EEFF",
		200: "#B7E0FF",
		300: "#97D0FF",
		400: "#5DB4FF",
		500: "#3DA3FF",
		600: "#318CDA",
		700: "#2774B5",
		800: "#1D5C90",
		900: "#14456B",
	},
	cyan: {
		50: "#EDF6F7",
		100: "#DAF3F7",
		200: "#BEF0FA",
		300: "#7DD4E8",
		400: "#48C8E8",
		500: "#2CC2E8",
		600: "#23ACCF",
		700: "#1F9AB5",
		800: "#15798F",
		900: "#0F5C6B",
	},
	emerald: tailWindColors.emerald,
	fuchsia: tailWindColors.fuchsia,
	gray: {
		50: "#F8FAFB",
		100: "#F2F5F8",
		150: "#EDF1F7",
		200: "#E4E8EE",
		300: "#CDD5DE",
		400: "#9CA5B0",
		500: "#6E7680",
		600: "#51565D",
		700: "#3D444E",
		800: "#282E38",
		900: "#171A21",
		950: "#111319",
	},
	green: {
		50: "#E8FBEB",
		100: "#CFF6D5",
		200: "#B6F1BF",
		300: "#86E593",
		400: "#4FD561",
		500: "#2BC841",
		600: "#22AD36",
		700: "#1B922B",
		800: "#0F5B1A",
		900: "#0A4412",
	},
	indigo: tailWindColors.indigo,
	"light-blue": tailWindColors.sky,
	lime: tailWindColors.lime,
	orange: tailWindColors.orange,
	pink: tailWindColors.pink,
	purple: tailWindColors.purple,
	red: {
		50: "#FFEFEE",
		100: "#FFD0CE",
		200: "#FFB2AE",
		300: "#FF9590",
		400: "#FF7A73",
		500: "#FE5F57",
		600: "#DA4F48",
		700: "#B5403A",
		800: "#90312C",
		900: "#6B2420",
	},
	rose: tailWindColors.rose,
	sky: tailWindColors.sky,
	teal: tailWindColors.teal,
	violet: tailWindColors.violet,
	yellow: {
		50: "#FFFAEC",
		100: "#FFF0C7",
		200: "#FFE49F",
		300: "#FFD777",
		400: "#FFC94F",
		500: "#FEBC2C",
		600: "#D9A122",
		700: "#AB8019",
		800: "#7B5D10",
		900: "#4A3809",
	},
};

const colors = {
	...colorPalette,
	primary: colorPalette.red,
	body: {
		background: {
			light: colorPalette.white,
			dark: colorPalette.black,
		},
		text: {
			300: {
				light: colorPalette.gray[400],
				dark: colorPalette.gray[500],
			},
			500: {
				light: colorPalette.gray[500],
				dark: colorPalette.gray[400],
			},
			1000: {
				light: colorPalette.gray[900],
				dark: colorPalette.white,
			},
		},
	},
	focusring: {
		light: colorPalette.red[700],
		dark: colorPalette.red[500],
	},
	link: {
		light: colorPalette.red[800],
		dark: colorPalette.red[400],
		hover: {
			light: colorPalette.red[700],
			dark: colorPalette.red[500],
		},
	},
	selection: {
		background: {
			light: colorPalette.red[800],
			dark: colorPalette.red[700],
		},
		foreground: {
			light: colorPalette.white,
			dark: colorPalette.white,
		},
	},
};

/** @type {import('tailwindcss/tailwind-config').TailwindConfig}*/
const config = {
	content: ["./app/**/*.{js,jsx,ts,tsx,mdx,html}"],
	darkMode: "media",
	theme: {
		screens: {
			...defaultTheme.screens,
			"xs-only": {
				max: `${parseInt(defaultTheme.screens.sm, 10) - 1}px`,
			},
			"sm-down": {
				max: `${parseInt(defaultTheme.screens.md, 10) - 1}px`,
			},
			"md-only": {
				min: `${parseInt(defaultTheme.screens.md)}px`,
				max: `${parseInt(defaultTheme.screens.lg, 10) - 1}px`,
			},
			"md-down": {
				max: `${parseInt(defaultTheme.screens.lg, 10) - 1}px`,
			},
			"lg-only": {
				min: `${parseInt(defaultTheme.screens.lg)}px`,
				max: `${parseInt(defaultTheme.screens.xl, 10) - 1}px`,
			},
			"lg-down": {
				max: `${parseInt(defaultTheme.screens.xl, 10) - 1}px`,
			},
			"xl-only": {
				min: `${parseInt(defaultTheme.screens.xl)}px`,
				max: `${parseInt(defaultTheme.screens["2xl"], 10) - 1}px`,
			},
			"xl-down": {
				max: `${parseInt(defaultTheme.screens["2xl"], 10) - 1}px`,
			},
		},
		lineHeight: {
			3: "0.875rem",
			4: "1rem",
			5: "1.325rem",
			6: "1.625rem",
			7: "1.825rem",
			8: "2rem;",
			9: "2.25rem",
			10: "2.5rem",
			none: "1",
			tight: "1.25",
			snug: "1.375",
			normal: "1.825",
			relaxed: "1.75",
			loose: "2",
		},
		fontWeight: {
			hairline: "100",
			"extra-light": "100",
			thin: "200",
			light: "300",
			normal: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
			extrabold: "800",
			"extra-bold": "800",
			black: "900",
		},
		colors,
		extend: {
			typography: (theme) => ({
				DEFAULT: {
					css: {
						maxWidth: "none",
						lineHeight: theme("lineHeight.normal"),
						color: theme("colors.gray.700"),

						blockquote: {
							color: theme("colors.gray.600"),
							fontWeight: "inherit",
							fontStyle: "inherit",
						},

						strong: {
							color: theme("colors.gray.900"),
						},

						a: {
							fontWeight: "inherit",
							color: theme("colors.blue.600"),
							borderBottom: 0,
							textDecoration: "underline",
							textDecorationColor: theme("colors.sky.300"),
							textDecorationThickness: "1px",
						},
						"a:hover": {
							color: theme("colors.blue.700"),
							textDecorationThickness: "2px",
						},
						"a code": {
							color: "inherit",
						},
						"a strong": {
							color: "inherit",
						},
						hr: {
							borderColor: theme("colors.gray.100"),
							marginTop: "3em",
							marginBottom: "3em",
						},
						"p,li,dd": {
							fontWeight: theme("fontWeight.normal"),
						},
						dd: {
							marginBottom: "0.5em",
						},
						dt: {
							marginTop: "0.5em",
							fontWeight: theme("fontWeight.bold"),
							color: theme("colors.blue.700"),
						},
						h1: {
							lineHeight: theme("lineHeight.tight"),
						},
						"h1,h2": {
							position: "relative",
							fontWeight: theme("fontWeight.medium"),
							backgroundColor: theme("colors.blue.600"),
							backgroundImage: `linear-gradient(to right, ${theme(
								"colors.blue.800"
							)}, ${theme("colors.blue.600")})`,
							WebkitBackgroundClip: "text",
							backgroundClip: "text",
							WebkitTextFillColor: "transparent",
							"scroll-margin-top": "var(--scroll-mt)",
						},
						h3: {
							position: "relative",
							color: theme("colors.blue.700"),
							fontWeight: theme("fontWeight.medium"),
							scrollMarginTop: "var(--scroll-mt)",
						},
						"h4,h5,h6": {
							position: "relative",
							color: theme("colors.blue.800"),
							fontWeight: theme("fontWeight.bold"),
							scrollMarginTop: "var(--scroll-mt)",
						},

						code: {
							fontWeight: theme("fontWeight.semibold"),
							fontSize: "inherit",
							fontVariantLigatures: "none",
							display: "inline-block",
							position: "relative",
						},

						pre: {
							backgroundColor: `var(--code-background)`,
							color: theme("colors.gray.700"),
							border: `1px solid ${theme("colors.gray.100")}`,
							borderRadius: theme("borderRadius.xl"),
							padding: theme("padding.5"),
							boxShadow: theme("boxShadow.md"),
							display: "flex",
							marginTop: "2em",
							marginBottom: "2em",
						},
						"pre code": {
							flex: "none",
							minWidth: "100%",
						},
						table: {
							fontSize: theme("fontSize.sm")[0],
							lineHeight: theme("fontSize.sm")[1].lineHeight,
						},
						thead: {
							color: theme("colors.gray.700"),
							borderBottomColor: theme("colors.gray.200"),
						},
						"thead th": {
							paddingTop: 0,
							fontWeight: theme("fontWeight.semibold"),
							color: theme("colors.gray.600"),
						},
						"tbody tr": {
							borderBottomColor: theme("colors.gray.100"),
						},
						"tbody tr:last-child": {
							borderBottomWidth: "1px",
						},
						"tbody code": {
							fontSize: theme("fontSize.xs")[0],
						},
						"figure figcaption": {
							textAlign: "center",
							fontStyle: "italic",
						},
						"figure > figcaption": {
							marginTop: "1.25em",
						},
					},
				},
				dark: {
					css: {
						color: theme("colors.gray.300"),

						blockquote: {
							color: theme("colors.gray.400"),
						},

						"h1,h2": {
							backgroundColor: theme("colors.blue.300"),
							backgroundImage: `linear-gradient(to right, ${theme(
								"colors.blue.200"
							)}, ${theme("colors.blue.300")})`,
						},
						h3: {
							color: theme("colors.blue.300"),
						},
						"h4,h5,h6": {
							color: theme("colors.blue.400"),
						},

						code: {
							color: theme("colors.gray.200"),
						},
						hr: {
							borderColor: theme("colors.gray.700"),
						},
						pre: {
							color: theme("colors.gray.300"),
							boxShadow: theme("boxShadow.md"),
							border: `1px solid ${theme("colors.gray.800")}`,
						},
						a: {
							color: theme("colors.blue.300"),
							textDecorationColor: theme("colors.blue.400"),
						},
						"a:hover": {
							color: theme("colors.blue.400"),
						},
						strong: {
							color: theme("colors.gray.200"),
						},
						thead: {
							color: theme("colors.gray.300"),
							borderBottomColor: theme("colors.gray.600"),
						},
						"thead th": {
							color: theme("colors.blue.300"),
						},
						"tbody tr": {
							borderBottomColor: theme("colors.gray.700"),
						},
						dt: {
							color: theme("colors.blue.300"),
						},
					},
				},
				markdown: {
					css: {
						...getHeadingStyles({ position: "relative" }, (level) => ({
							content: "'" + "#".repeat(level) + "'",
							position: "absolute",
							top: 0,
							right: "calc(100% + 1rem)",
							textAlign: "right",
							backgroundImage: "initial",
							WebkitBackgroundClip: "unset",
							backgroundClip: "unset",
							WebkitTextFillColor: theme("colors.gray.300"),
						})),
					},
				},
				"markdown-dark": {
					css: {
						...getHeadingStyles(null, {
							WebkitTextFillColor: theme("colors.gray.600"),
						}),
					},
				},
			}),
			fontFamily: {
				sans: ["Nunito", ...defaultTheme.fontFamily.sans],
				"sans-caps": ["brandon-grotesque", ...defaultTheme.fontFamily.sans],
				serif: ["cooper", ...defaultTheme.fontFamily.serif],
				system: defaultTheme.fontFamily.sans,
				mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
			},
			transitionProperty: {
				outline: "outline",
			},
			outlineOffset: {
				6: "6px",
				8: "8px",
				10: "10px",
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/aspect-ratio"),
		function ({ addVariant, addUtilities, theme, e }) {
			addUtilities({
				".gradient-heading": {
					backgroundColor: theme("colors.blue.600"),
					backgroundImage: `linear-gradient(to right, ${theme(
						"colors.blue.800"
					)}, ${theme("colors.blue.600")})`,
					WebkitBackgroundClip: "text",
					backgroundClip: "text",
					WebkitTextFillColor: "transparent",
					fontWeight: theme("fontWeight.medium"),
				},
				".gradient-heading-dark": {
					backgroundColor: theme("colors.blue.300"),
					backgroundImage: `linear-gradient(to right, ${theme(
						"colors.blue.200"
					)}, ${theme("colors.blue.300")})`,
					WebkitBackgroundClip: "text",
					backgroundClip: "text",
					WebkitTextFillColor: "transparent",
					fontWeight: theme("fontWeight.medium"),
				},
			});
			addVariant("not-hover", "&:not(:hover)");
			addVariant(
				"supports-scrollbars",
				"@supports selector(::-webkit-scrollbar)"
			);
			addVariant("scrollbar", "&::-webkit-scrollbar");
			addVariant("scrollbar-track", "&::-webkit-scrollbar-track");
			addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
			addVariant(
				"supports-backdrop-blur",
				"@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))"
			);
		},
	],
};

module.exports = config;

function getHeadingStyles(selectorStyles, beforeStyles, afterStyles) {
	return Array(6)
		.fill(null)
		.reduce((selectors, _, i) => {
			/** @type {string} */
			let level = i + 1;
			let selector = `h${level}`;
			return {
				...selectors,
				...(typeof selectorStyles === "function"
					? { [selector]: selectorStyles(level) }
					: selectorStyles != null && typeof selectorStyles === "object"
					? { [selector]: selectorStyles }
					: null),
				...(typeof beforeStyles === "function"
					? { [`${selector}::before`]: beforeStyles(level) }
					: beforeStyles != null && typeof beforeStyles === "object"
					? { [`${selector}::before`]: beforeStyles }
					: null),
				...(typeof afterStyles === "function"
					? { [`${selector}::after`]: afterStyles(level) }
					: afterStyles != null && typeof afterStyles === "object"
					? { [`${selector}::after`]: afterStyles }
					: null),
			};
		}, {});
}
