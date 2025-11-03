// Local functions
import componentExamples from "./components/index.js";
import { renderResults, renderSidebar } from "./scripts/renderers.js";

// Global functions
import { getDataForComponent } from "../scripts/getters.js";
import CustomElementHtmlAttributes from "../../src/classes/system-classes/CustomElementHtmlAttributes.js";
import { addContainerElement, createCustomElement, getTextResourcesFromResourceBindings } from "../../src/functions/helpers.js";

// Components
import "../../src/components/index.js";

// Data
import dataModels from "./data/dataModels.js";
import textResources from "./data/textResources.js";

// Stylesheets
import "./docs.css";

function getPreviewElement(component, data) {
    const htmlAttributes = new CustomElementHtmlAttributes({
        ...component,
        formData: data
    });
    return addContainerElement(createCustomElement(component?.tagName, htmlAttributes));
}

export function getResults(componentExamples, dataModels) {
    const resultsElements = Object.keys(componentExamples)
        .map((componentType) => {
            const componentsInType = componentExamples[componentType];
            const components = Object.keys(componentsInType).map((componentKey) => {
                const component = componentsInType[componentKey];
                if (!component?.tagName) {
                    return;
                }
                const data = getDataForComponent(component, dataModels);
                return {
                    element: getPreviewElement(component, data),
                    markup: component,
                    data,
                    resources: getTextResourcesFromResourceBindings(component?.resourceBindings)
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

window.onload = function () {
    window.textResources = textResources;
    const results = getResults(componentExamples, dataModels);
    console.log({ results });
    renderResults(results);
    renderSidebar(results);
};
