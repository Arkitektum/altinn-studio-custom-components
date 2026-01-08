// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderEiendomTable } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

function renderComponentProp(propertyName, propertyValue, component) {
    if (propertyValue === null || propertyValue === undefined) {
        return;
    }
    // Render nested objects recursively as <details>
    if (typeof propertyValue === "object" && !Array.isArray(propertyValue)) {
        const detailsElement = document.createElement("details");
        const summaryElement = document.createElement("summary");
        summaryElement.textContent = propertyName;
        detailsElement.appendChild(summaryElement);

        Object.entries(propertyValue).forEach(([key, value]) => {
            renderComponentProp(key, value, component)?.forEach((child) => detailsElement.appendChild(child));
        });

        return [detailsElement];
    }
    // Render primitive values as <p>
    const paragraphElement = document.createElement("p");
    paragraphElement.textContent = `${propertyName}: ${propertyValue}`;
    return [paragraphElement];
}

function renderComponentProps(component) {
    const containerElement = document.createElement("div");
    containerElement.className = "component-debug-info";
    Object.entries(component).forEach(([key, value]) => {
        renderComponentProp(key, value, component)?.forEach((child) => containerElement.appendChild(child));
    });
    return containerElement;
}

export default customElements.define(
    "custom-table-eiendom",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            console.log('CustomTableEiendom component:', component);
                const debugElement = renderComponentProps(component);
               // debugElement.style.display = "none";
                
                this.appendChild(debugElement);
                const eiendomTableElement = renderEiendomTable(component);
                this.appendChild(eiendomTableElement);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
