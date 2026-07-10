// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderFeedbackListElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedbacklist-data",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                alwaysHideWhenEmpty: true,
                render: (host, component) => {
                    const feedbackMessages = component?.resourceValues?.data;
                    const title = component?.resourceValues?.title || "Messages";
                    host.innerHTML = renderFeedbackListElement(title, feedbackMessages, component?.feedbackType, component?.styleOverride);
                }
            });
        }
    }
);
