// Local functions
import { renderResults, renderSidebar, renderTextResourceStatusIndicators } from "./renderers.ts";
import { applyLanguage } from "./language.ts";
import { getSelectedLanguage } from "../localStorage.ts";
import { setUpPreviewFit } from "./previewFit.ts";
import { setUpSplitter } from "./splitter.ts";
import { validateResources } from "../validators.ts";

/**
 * Initializes the application when the global context loads.
 * - Puts the text resources for the chosen language on globalThis: the app's own, stored in localStorage, and the package's, from `src/data/resources.json`.
 * - Renders the sidebar and results, and the text resource status from validating them.
 * - Puts the divider between the editor and the preview, and keeps the preview's page fitted to its width.
 */
globalThis.onload = function () {
    applyLanguage(getSelectedLanguage());
    renderSidebar();
    renderResults();
    const validationResults = validateResources();
    renderTextResourceStatusIndicators(validationResults);
    setUpSplitter();
    setUpPreviewFit();
};
