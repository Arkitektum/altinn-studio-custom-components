// Global functions
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Local functions
import { renderFeedbackListElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedbacklist-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const feedbackMessages = component?.resourceValues?.data;
            const title = component?.resourceValues?.title || "Messages";
            if (component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderFeedbackListElement(title, feedbackMessages, component?.feedbackType, component?.styleOverride);
            }
        }
    }
);
