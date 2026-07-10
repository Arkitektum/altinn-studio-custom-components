// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.js";

// Local functions
import {
    renderAnsvarsrettErklaertElement,
    renderArbeidetAvsluttetElement,
    renderAvdekketGjenstaaendePROElement,
    renderAvdekketGjenstaaendeUTFElement,
    renderBeskrivelseElement,
    renderEmptyFieldText,
    renderFunksjonElement,
    renderGjenstaaendeArbeiderInnenforElement,
    renderGjenstaaendeArbeiderUtenforElement,
    renderHeaderElement,
    renderTilstrekkeligSikkerhetElement,
    renderTypeArbeiderElement,
    renderUtfoereInnenElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-samsvar-ansvarsomraade",
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
                        const funksjonKodeverdi = component.resourceValues?.data?.funksjon?.kodeverdi?.toUpperCase();
                        const containerElement = document.createElement("div");

                        containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.ansvarsomraade?.title, component?.size));

                        containerElement.appendChild(renderFunksjonElement(component));
                        containerElement.appendChild(renderBeskrivelseElement(component));
                        containerElement.appendChild(renderAnsvarsrettErklaertElement(component));
                        containerElement.appendChild(renderArbeidetAvsluttetElement(component));
                        if (funksjonKodeverdi === "PRO") {
                            containerElement.appendChild(renderAvdekketGjenstaaendePROElement(component));
                        }

                        if (funksjonKodeverdi === "UTF") {
                            containerElement.appendChild(renderAvdekketGjenstaaendeUTFElement(component));
                        }
                        if (
                            funksjonKodeverdi === "UTF" &&
                            component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.erOkForMidlertidigBrukstillatelse === true &&
                            hasValue(component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.gjenstaaendeArbeider)
                        ) {
                            containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.gjenstaaendeArbeider?.title, component?.size));

                            containerElement.appendChild(renderGjenstaaendeArbeiderInnenforElement(component));
                            containerElement.appendChild(renderGjenstaaendeArbeiderUtenforElement(component));

                            containerElement.appendChild(renderHeaderElement(component?.resourceBindings?.sikkerhetsNivaa?.title, component?.size));

                            containerElement.appendChild(renderTilstrekkeligSikkerhetElement(component));

                            if (component?.resourceValues?.data?.utfoerende?.midlertidigBrukstillatelse?.sikkerhet?.harTilstrekkeligSikkerhet === false) {
                                containerElement.appendChild(renderUtfoereInnenElement(component));
                                containerElement.appendChild(renderTypeArbeiderElement(component));
                            }
                        }

                        host.appendChild(containerElement);
                    }
                }
            });
        }
    }
);
