// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

// Global functions
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import { renderFeedbackListElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedbacklist-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const feedbackMessages = component?.formData?.data;
            const title = component?.text || "Messages";
            if (!hasValue(feedbackMessages) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderFeedbackListElement(title, feedbackMessages, component?.feedbackType, component?.styleOverride);
            }
        }
    }
);
