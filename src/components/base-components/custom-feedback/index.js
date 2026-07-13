// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderFeedbackElement } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-feedback",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "base",
                alwaysHideWhenEmpty: true,
                render: (host, component) => {
                    const value = component?.resourceValues?.data;
                    host.innerHTML = renderFeedbackElement(value, component?.feedbackType);
                }
            });
        }
    }
);
