// Dependencies
import { createCustomElement, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderHeaderElement, renderUtfallSvarGroup } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-utfall-svar",
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
                        for (const utfallSvar of component?.resourceValues?.data ?? []) {
                            const utfallSvarElement = renderUtfallSvarGroup(utfallSvar, component);
                            host.appendChild(utfallSvarElement);
                            const dividerElement = createCustomElement("custom-divider");
                            host.appendChild(dividerElement);
                        }
                    }
                }
            });
        }
    }
);
