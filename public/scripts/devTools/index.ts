// Local functions
import { renderResults, renderSidebar, renderTextResourceStatusIndicators } from "./renderers.ts";
import { fetchDefaultTextResources } from "../getters.ts";
import { getTextResources } from "../localStorage.ts";
import { validateResources } from "../validators.ts";

/**
 * Initializes the application when the global context loads.
 * - Retrieves text resources from local storage and assigns them to `(globalThis.textResources as ApiValue)`.
 * - Fetches default text resources for the Norwegian Bokmål ('nb') language and assigns them to `(globalThis.defaultTextResources as ApiValue)`.
 * - Renders the sidebar and results using imported renderer functions.
 *
 * Dependencies:
 * - getTextResources: Function to fetch text resources from local storage.
 * - renderSidebar: Function to render the sidebar UI.
 * - renderResults: Function to render the results UI.
 * - validateResources: Function to perform validation on resources.
 */
globalThis.onload = async function () {
    globalThis.textResources = getTextResources();
    globalThis.defaultTextResources = await fetchDefaultTextResources("nb");
    renderSidebar();
    renderResults();
    const validationResults = validateResources();
    renderTextResourceStatusIndicators(validationResults);
};
