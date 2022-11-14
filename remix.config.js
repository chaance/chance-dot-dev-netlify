/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
	serverBuildTarget: "netlify",
	server: "./server.js",
	ignoredRouteFiles: [".*", "**/*.css", "**/*.scss"],
	// appDirectory: "app",
	// assetsBuildDirectory: "public/build",
	// serverBuildPath: ".netlify/functions-internal/server.js",
	// publicPath: "/build/",
};
