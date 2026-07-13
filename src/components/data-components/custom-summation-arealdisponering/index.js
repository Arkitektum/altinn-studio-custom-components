// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderSummationArealdisponering } from "./renderers.js";

export default customElements.define(
    "custom-summation-arealdisponering",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        const summationArealdisponeringElement = renderSummationArealdisponering(component);
                        if (component?.resourceValues?.title && component?.hideTitle !== true) {
                            host.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                        }
                        host.appendChild(summationArealdisponeringElement);
                    }
                }
            });
        }
    }
);
