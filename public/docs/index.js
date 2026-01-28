import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

// Local functions
import componentExamples from "./components/index.js";
import { renderResults, renderSidebar } from "./scripts/renderers.js";

// Global functions
import { fetchDefaultTextResources, getDataForComponent } from "../scripts/getters.js";
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";
import { addContainerElement, createCustomElement, getTextResourcesFromResourceBindings } from "../../src/functions/helpers.js";

// Components
import "../../src/components/index.js";

// Data
import dataModels from "./data/dataModels.js";
import textResources from "./data/textResources.js";

// Stylesheets
import "./docs.css";
import "highlight.js/styles/vs2015.css";

hljs.registerLanguage("json", json);

/**
 * Generates a preview DOM element for a given custom component and its data.
 *
 * @param {Object} component - The component definition, expected to include at least a `tagName` property.
 * @param {Object} data - The form data to be passed to the component as attributes.
 * @returns {HTMLElement} The container element wrapping the custom component preview.
 */
function getPreviewElement(component, data) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        ...component,
        formData: data
    });
    return addContainerElement(createCustomElement(component?.tagName, htmlAttributes));
}

/**
 * Generates a structured list of component preview results based on provided examples and data models.
 *
 * @param {Object} componentExamples - An object containing component examples grouped by type.
 * @param {Object} dataModels - An object representing available data models for the components.
 * @returns {Array<Object>} An array of result objects, each containing:
 *   - {string} type: The component type.
 *   - {Array<Object>} components: An array of component result objects, each with:
 *       - {React.ReactElement} element: The preview element for the component.
 *       - {Object} markup: The markup definition of the component.
 *       - {Object} data: The data generated for the component.
 *       - {Object} resources: The text resources associated with the component.
 */
export function getResults(componentExamples, dataModels) {
    const resultsElements = Object.keys(componentExamples)
        .map((componentType) => {
            const componentsInType = componentExamples[componentType];
            const components = Object.keys(componentsInType).map((componentKey) => {
                const component = componentsInType[componentKey];
                if (!component?.markup?.tagName) {
                    return;
                }
                const data = getDataForComponent(component?.markup, dataModels);
                return {
                    element: getPreviewElement(component?.markup, data),
                    markup: component?.markup,
                    options: component?.options,
                    data,
                    resources: getTextResourcesFromResourceBindings({ ...component?.defaultResourceBindings, ...component?.markup?.resourceBindings })
                };
            });
            return {
                type: componentType,
                components
            };
        })
        .filter((attr) => attr !== undefined);
    return resultsElements;
}

/**
 * Retrieves the results based on the provided component examples and data models.
 *
 * @param {Object} componentExamples - An object containing examples of components.
 * @param {Object} dataModels - An object containing data models to be used.
 * @returns {Array|Object} results - The processed results based on the inputs.
 */
globalThis.onload = async function () {
    globalThis.textResources = textResources;
    globalThis.defaultTextResources = await fetchDefaultTextResources("nb");
    const results = getResults(componentExamples, dataModels);
    renderResults(results);
    renderSidebar(results);
    hljs.highlightAll();
};
