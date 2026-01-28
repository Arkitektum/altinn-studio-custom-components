// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import {
    renderBeskrivelseElement,
    renderEmptyFieldText,
    renderHarTinglystErklaeringElement,
    renderHeaderElement,
    renderKrysserVannforsyningAnnensGrunnElement,
    renderTilknytningstypeElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-vannforsyning",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                if (component?.isEmpty) {
                    const emptyFieldTextElement = renderEmptyFieldText(component);
                    this.appendChild(emptyFieldTextElement);
                } else {
                    this.appendChild(renderTilknytningstypeElement(component));
                    this.appendChild(renderBeskrivelseElement(component));
                    this.appendChild(renderKrysserVannforsyningAnnensGrunnElement(component));
                    this.appendChild(renderHarTinglystErklaeringElement(component));
                }
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
