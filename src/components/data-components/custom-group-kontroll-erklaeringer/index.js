// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import { renderHeaderElement, renderErklaeringTekstElement, renderKONTROLLTekstElement, renderEmptyFieldText } from "./renderers.js";

export default customElements.define(
    "custom-group-kontroll-erklaeringer",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                if (hasValue(component?.resourceBindings?.erklaeringer?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceBindings?.erklaeringer?.title, component?.size));
                }
                if (component?.isEmpty) {
                    const emptyFieldTextElement = renderEmptyFieldText(component);
                    this.appendChild(emptyFieldTextElement);
                } else {
                    this.appendChild(renderErklaeringTekstElement(component));

                    let funksjon = component.resourceValues?.data?.funksjon?.kodeverdi?.toUpperCase();
                    if (funksjon === "KONTROLL") {
                        this.appendChild(renderKONTROLLTekstElement(component));
                    }
                }
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
