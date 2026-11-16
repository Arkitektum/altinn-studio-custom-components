// Local functions
import { getResourcesForLanguage } from "../textResourceGetters.ts";
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
 * Puts the text resources for a language on globalThis, which is where the components read them: the app's own text resources stored for that language, and the package's, and for any other language than nb, both in nb for a single text missing from those.
 *
 * @param {string} language - The language code, e.g. "nn".
 */
export function applyLanguage(language: string) {
    globalThis.selectedLanguage = language;
    globalThis.textResources = getTextResources(language);
    globalThis.defaultTextResources = getDefaultTextResourcesForLanguage(language);
    // For any other language than nb, the nb texts, the app's and the package's, are where a text missing from those above is looked up, as in the app.
    const readsFallbackLanguage = language === FALLBACK_LANGUAGE;
    globalThis.fallbackTextResources = readsFallbackLanguage ? null : getTextResources(FALLBACK_LANGUAGE);
    globalThis.fallbackDefaultTextResources = readsFallbackLanguage
        ? null
        : getResourcesForLanguage(multilingualDefaultTextResources, FALLBACK_LANGUAGE);
}
