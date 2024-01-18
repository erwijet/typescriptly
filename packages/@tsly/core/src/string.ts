export function str(s: string): TslyStr {
  return new TslyStr(s);
}

class TslyStr extends String {
  escapeRegex(): TslyStr {
    return str(
      this.replace(/[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
    ); /* eslint-disable-line no-useless-escape */
  }

  sliceTo(to: string, nth = 0): TslyStr {
    const sliced = this.slice(0, this.indexOf(to) + to.length);

    if (sliced == "") return this; // no match
    if (nth == 0) return str(sliced);
    else
      return str(sliced + str(this.slice(sliced.length)).sliceTo(to, nth - 1));
  }

  capitalize(): TslyStr {
    if (this.take() == "") return this;
    return str(this.at(0)!.toUpperCase() + this.slice(1).toLowerCase());
  }

  maybeParseInt(radix?: number): number | null {
    const parsed = parseInt(this.take(), radix);
    return isNaN(parsed) ? null : parsed;
  }

  maybeParseFloat(): number | null {
    const parsed = parseFloat(this.take());
    return isNaN(parsed) ? null : parsed;
  }

  take(): string {
    return this.slice(0);
  }
}

// /**
//  * Given a string that contains regex commands, escape those characters to match as literals with regex.
//  *
//  * @example
//  * ```ts
//  * new RegExp("$50").test("$50"); // false
//  * new RegExp(escapeRegex("$50")).test("$50"); // true
//  * ```
//  *
//  * ?> special thanks to mary.strodl@bryx.com and https://stackoverflow.com/a/3561711
//  */
// export function escapeRegex(s: string): string {
//   return s.replace(
//     /[\-\[\]\/\{}\(\)\*\+\?\.\\\^\$\|]/g,
//     "\\$&"
//   ); /* eslint-disable-line no-useless-escape */
// }

// /**
//  * Get a substring of the given string `str` from the origin of the string to the first or nth occurance of the given `to` string
//  *
//  * @example
//  * ```ts
//  * const str = 'apple.banana.orange.kiwi';
//  * sliceStrTo(str, '.'); // 'apple.'
//  * sliceStrTo(str, '.', 2); // 'apple.banana.orange.'
//  * ```
//  */
// export function sliceStrTo(str: string, to: string, nth = 0): string {}

// /**
//  * Parses a string into an integer, returning `null` instead of `NaN` if parsing fails
//  *
//  * @example
//  * ```ts
//  * // returns 10
//  * maybeParseInt('10');
//  * ```
//  *
//  * @example
//  * ```ts
//  * maybeParseInt('abc');
//  * // returns null
//  * ```
//  *
//  * @param str - The string to parse.
//  * @param radix - The radix used to parse the string. Defaults to 10.
//  * @returns The parsed integer, or null if parsing fails.
//  *
//  */
// export function maybeParseInt(str: string, radix?: number): number | null {
//   const parsed = parseInt(str, radix);
//   return isNaN(parsed) ? null : parsed;
// }

// /**
//  * Parses a string into a floating-point number, returning null instead of `NaN` if parsing fails.
//  *
//  * @example
//  * ```ts
//  * maybeParseFloat('3.14');
//  * // returns 3.14
//  * ```
//  *
//  * @example
//  * ```ts
//  * maybeParseFloat('abc');
//  * // returns null
//  * ```
//  *
//  * @param str - The string to parse.
//  * @returns The parsed number, or null if parsing fails.
//  */
// export function maybeParseFloat(str: string): number | null {
//   const parsed = parseFloat(str);
//   return isNaN(parsed) ? null : parsed;
// }
