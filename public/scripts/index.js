// import A11yDialog from "./a11y-dialog.min.js";
// let dialogEl = document.getElementById("site-settings-dialog");
// let mainEl = document.querySelector("main");
// let dialog = new A11yDialog(dialogEl, mainEl);
// dialog.on("show", (dialogEl, triggerEl) => {
// 	// do stuff maybe
// });

// https://www.filamentgroup.com/lab/load-css-simpler/
let googleFontsPreloadLink = document.getElementById(
	"google-fonts-preload-link"
);
googleFontsPreloadLink?.addEventListener("load", (event) => {
	event.currentTarget.media = "all";
});
