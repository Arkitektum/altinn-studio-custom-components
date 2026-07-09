// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import {
    renderEmptyFieldText,
    renderErklaeringTekstElement,
    renderHeaderElement,
    renderPROTekstElement,
    renderUTFTekstElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-samsvar-erklaeringer",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    let funksjonList = [];
                    if (hasValue(component?.resourceBindings?.erklaeringer?.title) && component?.hideTitle !== true) {
                        host.appendChild(renderHeaderElement(component?.resourceBindings?.erklaeringer?.title, component?.size));
                    }
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        component.resourceValues?.data?.forEach((element) => {
                            funksjonList.push(element.funksjon?.kodeverdi?.toUpperCase());
                        });

                        host.appendChild(renderErklaeringTekstElement(component));
                        if (funksjonList.includes("PRO")) {
                            host.appendChild(renderPROTekstElement(component));
                        }
                        if (funksjonList.includes("UTF")) {
                            host.appendChild(renderUTFTekstElement(component));
                        }
                    }
                }
            });
        }
    }
);
