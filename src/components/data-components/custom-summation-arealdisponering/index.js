// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderSummationArealdisponering } from "./renderers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";

export default customElements.define(
    "custom-summation-arealdisponering",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component, "data");
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else {
                    componentContainerElement.style.display = "none";
                }
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
                addDevToolsOverlay(this, component, "data");
            } else {
                const summationArealdisponeringElement = renderSummationArealdisponering(component);
                if (component?.resourceValues?.title && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                this.appendChild(summationArealdisponeringElement);
                addDevToolsOverlay(this, component, "data");
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
