import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

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
import "highlight.js/styles/vs2015.css";

hljs.registerLanguage("json", json);

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
                if (!component?.markup?.tagName) {
                    return;
                }
                const data = getDataForComponent(component?.markup, dataModels);
                return {
                    element: getPreviewElement(component?.markup, data),
                    markup: component?.markup,
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

globalThis.onload = function () {
    globalThis.textResources = textResources;
    const results = getResults(componentExamples, dataModels);
    renderResults(results);
    renderSidebar(results);
    hljs.highlightAll();
};
