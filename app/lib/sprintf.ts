import { isString } from "~/lib/utils";

// https://github.com/alexei/sprintf.js/blob/master/src/sprintf.js
// https://github.com/alexei/sprintf.js/blob/master/README.md
const RE = {
	notString: /[^s]/,
	notBool: /[^t]/,
	notType: /[^T]/,
	notPrimitive: /[^v]/,
	number: /[diefg]/,
	numericArg: /[bcdiefguxX]/,
	json: /[j]/,
	notJSON: /[^j]/,
	text: /^[^\x25]+/,
	modulo: /^\x25{2}/,
	placeholder:
		/^\x25(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
	key: /^([a-z_][a-z_\d]*)/i,
	keyAccess: /^\.([a-z_][a-z_\d]*)/i,
	indexAccess: /^\[(\d+)\]/,
	sign: /^[+-]/,
};

/**
 * Returns a formatted string.
 *
 * ### Argument swapping
 *
 * You can also swap the arguments. That is, the order of the placeholders
 * doesn't have to match the order of the arguments. You can do that by simply
 * indicating in the format string which arguments the placeholders refer to:
 *
 *     sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants')
 *
 * And, of course, you can repeat the placeholders without having to increase
 * the number of arguments.
 *
 * ### Named arguments
 *
 * Format strings may contain replacement fields rather than positional
 * placeholders. Instead of referring to a certain argument, you can now refer
 * to a certain key within an object. Replacement fields are surrounded by
 * rounded parentheses - `(` and `)` - and begin with a keyword that refers to a
 * key:
 *
 *     let user = {
 *       name: 'Dolly',
 *     };
 *     // Hello Dolly
 *     sprintf('Hello %(name)s', user);
 *
 * Keywords in replacement fields can be optionally followed by any number of
 * keywords or indexes:
 *
 *     let users = [
 *       { name: 'Dolly' },
 *       { name: 'Molly' },
 *       { name: 'Polly' },
 *     ];
 *     // Hello Dolly, Molly and Polly
 *     sprintf('Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s', { users });
 *
 * Note: mixing positional and named placeholders is not (yet) supported
 *
 * ### Computed values
 *
 * You can pass in a function as a dynamic value and it will be invoked (with no
 * arguments) in order to compute the value on the fly.
 *
 *      sprintf('Current date and time: %s', () => new Date().toString());
 *
 * @param format The placeholders in the format string are marked by `%` and are
 *               followed by one or more of these elements, in this order:
 *   * An optional number followed by a `$` sign that selects which argument
 *     index to use for the value. If not specified, arguments will be placed in
 *     the same order as the placeholders in the input string.
 *   * An optional `+` sign that forces to preceed the result with a plus or
 *     minus sign on numeric values. By default, only the `-` sign is used on
 *     negative numbers.
 *   * An optional padding specifier that says what character to use for padding
 *     (if specified). Possible values are `0` or any other character precedeed
 *     by a `'` (single quote). The default is to pad with *spaces*.
 *   * An optional `-` sign, that causes `sprintf` to left-align the result of
 *     this placeholder. The default is to right-align the result.
 *   * An optional number, that says how many characters the result should have.
 *     If the value to be returned is shorter than this number, the result will
 *     be padded. When used with the `j` (JSON) type specifier, the padding
 *     length specifies the tab size used for indentation.
 *   * An optional precision modifier, consisting of a `.` (dot) followed by a
 *     number, that says how many digits should be displayed for floating point
 *     numbers. When used with the `g` type specifier, it specifies the number
 *     of significant digits. When used on a string, it causes the result to be
 *     truncated.
 *   * A type specifier that can be any of:
 *       * `%` — yields a literal `%` character
 *       * `b` — yields an integer as a binary number
 *       * `c` — yields an integer as the character with that ASCII value
 *       * `d` or `i` — yields an integer as a signed decimal number
 *       * `e` — yields a float using scientific notation
 *       * `u` — yields an integer as an unsigned decimal number
 *       * `f` — yields a float as is; see notes on precision above
 *       * `g` — yields a float as is; see notes on precision above
 *       * `o` — yields an integer as an octal number
 *       * `s` — yields a string as is
 *       * `t` — yields `true` or `false`
 *       * `T` — yields the type of the argument<sup><a href="#fn-1"
 *               name="fn-ref-1">1</a></sup>
 *       * `v` — yields the primitive value of the specified argument
 *       * `x` — yields an integer as a hexadecimal number (lower-case)
 *       * `X` — yields an integer as a hexadecimal number (upper-case)
 *       * `j` — yields a JavaScript object or array as a JSON encoded string
 * @param args The arguments for the format string.
 */
export function sprintf(format: string, ...args: any[]): string;
export function sprintf(format: string): string {
	return sprintfFormat(sprintfParse(format), arguments);
}

/**
 * Same as `sprintf` except it takes an array of arguments, rather than a
 * variable number of arguments.
 *
 * ### Argument swapping
 *
 * You can also swap the arguments. That is, the order of the placeholders
 * doesn't have to match the order of the arguments. You can do that by simply
 * indicating in the format string which arguments the placeholders refer to:
 *
 *     sprintf('%2$s %3$s a %1$s', 'cracker', 'Polly', 'wants')
 *
 * And, of course, you can repeat the placeholders without having to increase
 * the number of arguments.
 *
 * ### Named arguments
 *
 * Format strings may contain replacement fields rather than positional
 * placeholders. Instead of referring to a certain argument, you can now refer
 * to a certain key within an object. Replacement fields are surrounded by
 * rounded parentheses - `(` and `)` - and begin with a keyword that refers to a
 * key:
 *
 *     let user = {
 *       name: 'Dolly',
 *     };
 *     // Hello Dolly
 *     sprintf('Hello %(name)s', user);
 *
 * Keywords in replacement fields can be optionally followed by any number of
 * keywords or indexes:
 *
 *     let users = [
 *       { name: 'Dolly' },
 *       { name: 'Molly' },
 *       { name: 'Polly' },
 *     ];
 *     // Hello Dolly, Molly and Polly
 *     sprintf('Hello %(users[0].name)s, %(users[1].name)s and %(users[2].name)s', { users });
 *
 * Note: mixing positional and named placeholders is not (yet) supported
 *
 * ### Computed values
 *
 * You can pass in a function as a dynamic value and it will be invoked (with no
 * arguments) in order to compute the value on the fly.
 *
 *      sprintf('Current date and time: %s', () => new Date().toString());
 *
 * @param format The placeholders in the format string are marked by `%` and are
 *               followed by one or more of these elements, in this order:
 *   * An optional number followed by a `$` sign that selects which argument
 *     index to use for the value. If not specified, arguments will be placed in
 *     the same order as the placeholders in the input string.
 *   * An optional `+` sign that forces to preceed the result with a plus or
 *     minus sign on numeric values. By default, only the `-` sign is used on
 *     negative numbers.
 *   * An optional padding specifier that says what character to use for padding
 *     (if specified). Possible values are `0` or any other character precedeed
 *     by a `'` (single quote). The default is to pad with *spaces*.
 *   * An optional `-` sign, that causes `sprintf` to left-align the result of
 *     this placeholder. The default is to right-align the result.
 *   * An optional number, that says how many characters the result should have.
 *     If the value to be returned is shorter than this number, the result will
 *     be padded. When used with the `j` (JSON) type specifier, the padding
 *     length specifies the tab size used for indentation.
 *   * An optional precision modifier, consisting of a `.` (dot) followed by a
 *     number, that says how many digits should be displayed for floating point
 *     numbers. When used with the `g` type specifier, it specifies the number
 *     of significant digits. When used on a string, it causes the result to be
 *     truncated.
 *   * A type specifier that can be any of:
 *       * `%` — yields a literal `%` character
 *       * `b` — yields an integer as a binary number
 *       * `c` — yields an integer as the character with that ASCII value
 *       * `d` or `i` — yields an integer as a signed decimal number
 *       * `e` — yields a float using scientific notation
 *       * `u` — yields an integer as an unsigned decimal number
 *       * `f` — yields a float as is; see notes on precision above
 *       * `g` — yields a float as is; see notes on precision above
 *       * `o` — yields an integer as an octal number
 *       * `s` — yields a string as is
 *       * `t` — yields `true` or `false`
 *       * `T` — yields the type of the argument<sup><a href="#fn-1"
 *               name="fn-ref-1">1</a></sup>
 *       * `v` — yields the primitive value of the specified argument
 *       * `x` — yields an integer as a hexadecimal number (lower-case)
 *       * `X` — yields an integer as a hexadecimal number (upper-case)
 *       * `j` — yields a JavaScript object or array as a JSON encoded string
 * @param argv The arguments for the format string.
 */
export function vsprintf(format: string, argv?: any[]) {
	return sprintf.apply(null, [format, ...(argv || [])]);
}

function sprintfFormat(
	parseTree: (string | ParseTreeItem)[],
	argv: IArguments
) {
	let cursor = 1;
	let output: string = "";
	let ph: ParseTreeItem;
	let pad: string;
	let padCharacter: string;
	let padLength: number;
	let isPositive = false;
	let sign: string;
	let arg: any;

	for (let i = 0; i < parseTree.length; i++) {
		let parseTreeItem = parseTree[i];
		if (isString(parseTreeItem)) {
			output += parseTreeItem;
		} else if (typeof parseTreeItem === "object") {
			ph = parseTreeItem; // convenience purposes only
			if (ph.keys) {
				// keyword argument
				arg = argv[cursor];
				for (let k = 0; k < ph.keys.length; k++) {
					if (arg == undefined) {
						throw new Error(
							sprintf(
								'[sprintf] Cannot access property "%s" of undefined value "%s"',
								ph.keys[k],
								ph.keys[k - 1]
							)
						);
					}
					arg = arg[ph.keys[k]];
				}
			} else if (ph.paramNo) {
				// positional argument (explicit)
				arg = argv[ph.paramNo as any];
			} else {
				// positional argument (implicit)
				arg = argv[cursor++];
			}

			if (
				RE.notType.test(ph.type) &&
				RE.notPrimitive.test(ph.type) &&
				arg instanceof Function
			) {
				arg = arg();
			}

			if (
				RE.numericArg.test(ph.type) &&
				typeof arg !== "number" &&
				isNaN(arg)
			) {
				throw new TypeError(
					sprintf("[sprintf] expecting number but found %T", arg)
				);
			}

			if (RE.number.test(ph.type)) {
				isPositive = arg >= 0;
			}

			switch (ph.type) {
				case "b":
					arg = parseInt(arg, 10).toString(2);
					break;
				case "c":
					arg = String.fromCharCode(parseInt(arg, 10));
					break;
				case "d":
				case "i":
					arg = parseInt(arg, 10);
					break;
				case "j":
					arg = JSON.stringify(arg, null, ph.width ? parseInt(ph.width) : 0);
					break;
				case "e":
					arg = ph.precision
						? parseFloat(arg).toExponential(Number(ph.precision))
						: parseFloat(arg).toExponential();
					break;
				case "f":
					arg = ph.precision
						? parseFloat(arg).toFixed(Number(ph.precision))
						: parseFloat(arg);
					break;
				case "g":
					arg = ph.precision
						? String(Number(arg.toPrecision(ph.precision)))
						: parseFloat(arg);
					break;
				case "o":
					arg = (parseInt(arg, 10) >>> 0).toString(8);
					break;
				case "s":
					arg = String(arg);
					arg = ph.precision ? arg.substring(0, ph.precision) : arg;
					break;
				case "t":
					arg = String(!!arg);
					arg = ph.precision ? arg.substring(0, ph.precision) : arg;
					break;
				case "T":
					arg = Object.prototype.toString.call(arg).slice(8, -1).toLowerCase();
					arg = ph.precision ? arg.substring(0, ph.precision) : arg;
					break;
				case "u":
					arg = parseInt(arg, 10) >>> 0;
					break;
				case "v":
					arg = arg.valueOf();
					arg = ph.precision ? arg.substring(0, ph.precision) : arg;
					break;
				case "x":
					arg = (parseInt(arg, 10) >>> 0).toString(16);
					break;
				case "X":
					arg = (parseInt(arg, 10) >>> 0).toString(16).toUpperCase();
					break;
			}
			if (RE.json.test(ph.type)) {
				output += arg;
			} else {
				if (RE.number.test(ph.type) && (!isPositive || ph.sign)) {
					sign = isPositive ? "+" : "-";
					arg = arg.toString().replace(RE.sign, "");
				} else {
					sign = "";
				}
				padCharacter = ph.padChar
					? ph.padChar === "0"
						? "0"
						: ph.padChar.charAt(1)
					: " ";
				padLength = Number(ph.width) - (sign + arg).length;
				pad = ph.width
					? padLength > 0
						? padCharacter.repeat(padLength)
						: ""
					: "";
				output += ph.align
					? sign + arg + pad
					: padCharacter === "0"
					? sign + pad + arg
					: pad + sign + arg;
			}
		}
	}
	return output;
}

let sprintfCache = Object.create(null);

function sprintfParse(format: string): (string | ParseTreeItem)[] {
	if (sprintfCache[format]) {
		return sprintfCache[format];
	}

	let _fmt = format;
	let match;
	let parseTree: (string | ParseTreeItem)[] = [];
	let argNames = 0;
	while (_fmt) {
		if ((match = RE.text.exec(_fmt)) !== null) {
			parseTree.push(match[0]);
		} else if ((match = RE.modulo.exec(_fmt)) !== null) {
			parseTree.push("%");
		} else if ((match = RE.placeholder.exec(_fmt)) !== null) {
			if (match[2]) {
				argNames |= 1;
				let fieldList = [];
				let replacementField = match[2];
				let fieldMatch: any[] | null = [];
				if ((fieldMatch = RE.key.exec(replacementField)) !== null) {
					fieldList.push(fieldMatch[1]);
					while (
						(replacementField = replacementField.substring(
							fieldMatch[0].length
						)) !== ""
					) {
						if ((fieldMatch = RE.keyAccess.exec(replacementField)) !== null) {
							fieldList.push(fieldMatch[1]);
						} else if (
							(fieldMatch = RE.indexAccess.exec(replacementField)) !== null
						) {
							fieldList.push(fieldMatch[1]);
						} else {
							throw new SyntaxError(
								"[sprintf] failed to parse named argument key"
							);
						}
					}
				} else {
					throw new SyntaxError("[sprintf] failed to parse named argument key");
				}
				(match as any)[2] = fieldList;
			} else {
				argNames |= 2;
			}
			if (argNames === 3) {
				throw new Error(
					"[sprintf] mixing positional and named placeholders is not (yet) supported"
				);
			}

			parseTree.push({
				placeholder: match[0],
				paramNo: match[1],
				keys: match[2],
				sign: match[3],
				padChar: match[4],
				align: match[5],
				width: match[6],
				precision: match[7],
				type: match[8],
			});
		} else {
			throw new SyntaxError("[sprintf] unexpected placeholder");
		}
		_fmt = _fmt.substring(match[0].length);
	}
	return (sprintfCache[format] = parseTree);
}

type ParseTreeItem = {
	placeholder: string;
	paramNo: string;
	keys: string;
	sign: string;
	padChar: string;
	align: string;
	width: string;
	precision: string;
	type: string;
};
