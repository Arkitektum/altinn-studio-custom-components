// Local functions
import { getTextResources } from "./localStorage.js";
import { renderResults, renderSidebar } from "./renderers.js";

/**
 * Initializes the application when the window loads.
 * - Retrieves text resources from local storage and assigns them to `window.textResources`.
 * - Renders the sidebar and results using imported renderer functions.
 *
 * Dependencies:
 * - getTextResources: Function to fetch text resources from local storage.
 * - renderSidebar: Function to render the sidebar UI.
 * - renderResults: Function to render the results UI.
 */
window.onload = function () {
    window.textResources = getTextResources();
    renderSidebar();
    renderResults();
};
