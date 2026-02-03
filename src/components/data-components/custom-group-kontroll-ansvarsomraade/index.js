// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import {
    renderEmptyFieldText,
    renderHeaderElement,
    renderFunksjonElement,
    renderBeskrivelseElement,
    renderAnsvarsrettErklaertElement,
    renderArbeidetAvsluttetElement,
    renderFunnetAvvikElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-kontroll-ansvarsomraade",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
            } else {
                const containerElement = document.createElement("div");

                containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.ansvarsomraade?.title, component?.size));

                containerElement.appendChild(renderFunksjonElement(component));
                containerElement.appendChild(renderBeskrivelseElement(component));
                containerElement.appendChild(renderAnsvarsrettErklaertElement(component));
                containerElement.appendChild(renderArbeidetAvsluttetElement(component));

                containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.sluttrapport?.title, component?.size));
                containerElement.appendChild(renderFunnetAvvikElement(component));

                this.appendChild(containerElement);
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
