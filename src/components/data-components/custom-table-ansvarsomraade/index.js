// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderAnsvarsomraadeTable } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";

export default customElements.define(
    "custom-table-ansvarsomraade",
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
            } else {
                const ansvarsomraadeTableElement = renderAnsvarsomraadeTable(component);
                this.appendChild(ansvarsomraadeTableElement);
                addDevToolsOverlay(this, component, "data");
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
