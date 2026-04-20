// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderEmptyFieldText, renderVegtypeTillatelseElement } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-vegtype-tillatelse",
    class extends HTMLElement {
        async connectedCallback() {
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
            } else if (component?.resourceValues?.data) {
                const vegtypeTillatelseData = component.resourceValues.data;
                if (Array.isArray(vegtypeTillatelseData)) {
                    for (const vegtypeTillatelse of vegtypeTillatelseData) {
                        const vegtypeTillatelseElement = renderVegtypeTillatelseElement(component, vegtypeTillatelse);
                        this.appendChild(vegtypeTillatelseElement);
                    }
                }
                addDevToolsOverlay(this, component, "data");
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
