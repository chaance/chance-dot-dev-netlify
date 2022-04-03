import fsp from "fs/promises";
export async function isDirectory(path: string) {
	try {
		return (await fsp.stat(path)).isDirectory();
	} catch (_) {
		return false;
	}
}
