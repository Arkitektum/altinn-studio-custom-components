/**
 * The languages this package ships default text resources for, one `resource.<language>.json` each.
 *
 * Asking an app for any other language is a guaranteed 404, so the loader goes straight to the fallback for it instead
 * of requesting the file and logging the miss as an error. `resources.test.ts` checks this against the languages
 * `resources.json` actually holds, so adding values in a new language fails the tests until it is listed here.
 */
export const defaultTextResourceLanguages: readonly string[] = Object.freeze(["nb"]);
