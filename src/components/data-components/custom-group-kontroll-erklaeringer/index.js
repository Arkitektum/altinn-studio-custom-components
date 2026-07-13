// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderEmptyFieldText, renderErklaeringTekstElement, renderHeaderElement, renderKONTROLLTekstElement } from "./renderers.js";

export default customElements.define(
    "custom-group-kontroll-erklaeringer",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    if (hasValue(component?.resourceBindings?.erklaeringer?.title) && component?.hideTitle !== true) {
                        host.appendChild(renderHeaderElement(component?.resourceBindings?.erklaeringer?.title, component?.size));
                    }
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        host.appendChild(renderErklaeringTekstElement(component));

                        let funksjon = component.resourceValues?.data?.funksjon?.kodeverdi?.toUpperCase();
                        if (funksjon === "KONTROLL") {
                            host.appendChild(renderKONTROLLTekstElement(component));
                        }
                    }
                }
            });
        }
    }
);
