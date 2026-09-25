import type AnsvarsrettAnsvarsomraade from "../../../classes/data-classes/AnsvarsrettAnsvarsomraade.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import {
    renderEmptyFieldText,
    renderErklaeringTekstElement,
    renderHeaderElement,
    renderKONTROLLTekstElement,
    renderPROTekstElement,
    renderSOEKTekstElement,
    renderUTFTekstElement
} from "./renderers.ts";

export default customElements.define(
    "custom-group-ansvarsrett-erklaeringer",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    const funksjonList: string[] = [];
                    if (hasValue(component?.resourceBindings?.erklaeringer?.title) && component?.hideTitle !== true) {
                        host.appendChild(renderHeaderElement(component?.resourceBindings?.erklaeringer?.title, component?.size));
                    }
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        (component?.resourceValues?.data as AnsvarsrettAnsvarsomraade[] | undefined)?.forEach((element) => {
                            funksjonList.push(element.funksjon?.kodeverdi?.toUpperCase() as string);
                        });

                        host.appendChild(renderErklaeringTekstElement(component));

                        host.appendChild(renderSOEKTekstElement(component));

                        if (funksjonList.includes("PRO")) {
                            host.appendChild(renderPROTekstElement(component));
                        }
                        if (funksjonList.includes("UTF")) {
                            host.appendChild(renderUTFTekstElement(component));
                        }
                        if (funksjonList.includes("KONTROLL")) {
                            host.appendChild(renderKONTROLLTekstElement(component));
                        }
                    }
                }
            });
        }
    }
);
