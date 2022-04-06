import A11yDialog from "./a11y-dialog.min.js";

let dialogEl = document.getElementById("site-settings-dialog");
let mainEl = document.querySelector("main");
let dialog = new A11yDialog(dialogEl, mainEl);

dialog.on("show", function (dialogEl, triggerEl) {
	// do stuff maybe
});
