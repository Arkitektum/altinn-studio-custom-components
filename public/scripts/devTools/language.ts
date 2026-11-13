// Local functions
import { getResourcesForLanguage } from "../getters.ts";
import { getTextResources } from "../localStorage.ts";

// Data
import multilingualDefaultTextResources from "../../../src/data/resources.json";

export const FALLBACK_LANGUAGE = "nb";

/**
 * The package's own text resources in a language, read from `src/data/resources.json`, so a language added there shows up without anything to copy or link.
 * A language without any of them falls back to nb, the way an app falls back when the package has no resource file for its language.
 *
 * @param {string} language - The language code, e.g. "nn".
 * @param {Array} [multilingualResources] - The text resources in every language, those in `src/data/resources.json` when left out.
 * @returns {{ language: string, resources: Array<{ id: string, value: string }> }} The text resources.
 */
export function getDefaultTextResourcesForLanguage(language: string, multilingualResources: unknown[] = multilingualDefaultTextResources) {
    const textResources = getResourcesForLanguage(multilingualResources, language);
    return textResources.resources.length ? textResources : getResourcesForLanguage(multilingualResources, FALLBACK_LANGUAGE);
}

/**
 * Puts the text resources for a language on globalThis, which is where the components read them: the app's own text resources stored for that language, and the package's.
 *
 * @param {string} language - The language code, e.g. "nn".
 */
export function applyLanguage(language: string) {
    globalThis.selectedLanguage = language;
    globalThis.textResources = getTextResources(language);
    globalThis.defaultTextResources = getDefaultTextResourcesForLanguage(language);
}
