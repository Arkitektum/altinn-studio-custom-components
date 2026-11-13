// Local functions
import { renderResults, renderSidebar, renderTextResourceStatusIndicators } from "./renderers.ts";
import { applyLanguage } from "./language.ts";
import { getSelectedLanguage } from "../localStorage.ts";
import { validateResources } from "../validators.ts";

/**
 * Initializes the application when the global context loads.
 * - Puts the text resources for the chosen language on globalThis: the app's own, stored in localStorage, and the package's, from `src/data/resources.json`.
 * - Renders the sidebar and results, and the text resource status from validating them.
 */
globalThis.onload = function () {
    applyLanguage(getSelectedLanguage());
    renderSidebar();
    renderResults();
    const validationResults = validateResources();
    renderTextResourceStatusIndicators(validationResults);
};
