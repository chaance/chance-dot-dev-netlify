import fsp from "fs/promises";

export async function isDirectory(path: string) {
	try {
		return (await fsp.stat(path)).isDirectory();
	} catch (_) {
		return false;
	}
}

export async function readableFileExists(filePath: string) {
	try {
		let openned = await fsp.open(filePath, "r");
		openned.close();
		return true;
	} catch (_) {
		return false;
	}
}
