// Global functions
import { getComponentContainerElement } from "../../../../functions/helpers.js";
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderEmptyFieldText } from "../../custom-grouplist-sjekklistekrav/custom-group-sjekklistekrav/renderers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";

// Local functions
import { renderUtfallSvarGroupList } from "./renderers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../../functions/devToolsHelpers.js";

export default customElements.define(
    "custom-group-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
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
                const utfallSvarGroupListElement = renderUtfallSvarGroupList(component);
                this.appendChild(utfallSvarGroupListElement);
                addDevToolsOverlay(this, component, "data");
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
