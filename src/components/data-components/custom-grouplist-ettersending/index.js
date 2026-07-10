// Dependencies
import { createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderEttersendingGroup, renderHeaderElement } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-ettersending",
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
                        if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                            host.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                        }
                        for (const ettersending of component?.resourceValues?.data ?? []) {
                            const ettersendingElement = renderEttersendingGroup(ettersending, component);
                            host.appendChild(ettersendingElement);
                            const dividerElement = createCustomElement("custom-divider");
                            host.appendChild(dividerElement);
                        }
                    }
                }
            });
        }
    }
);
