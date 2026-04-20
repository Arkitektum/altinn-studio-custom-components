// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import {
    renderEmptyFieldText,
    renderHeaderElement,
    renderLedesOvervannTilAvloepssystemElement,
    renderLedesOvervannTilTerrengElement
} from "./renderers.js";
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";

export default customElements.define(
    "custom-group-overvann",
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
            } else {
                if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                if (component?.isEmpty) {
                    const emptyFieldTextElement = renderEmptyFieldText(component);
                    this.appendChild(emptyFieldTextElement);
                } else {
                    this.appendChild(renderLedesOvervannTilTerrengElement(component));
                    this.appendChild(renderLedesOvervannTilAvloepssystemElement(component));
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
