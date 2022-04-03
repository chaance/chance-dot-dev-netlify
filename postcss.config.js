const plugins = {
	"postcss-import": {},
	"postcss-preset-env": {
		stage: 1,
		features: {
			"logical-properties-and-values": {
				preserve: true,
			},
			// handled by tailwindcss/nesting
			"nesting-rules": false,
		},
	},
	"tailwindcss/nesting": {},
	tailwindcss: {},
	"postcss-100vh-fix": {},
};

if (process.env.NODE_ENV === "production") {
	plugins["cssnano"] = {};
}

module.exports = {
	plugins,
};
