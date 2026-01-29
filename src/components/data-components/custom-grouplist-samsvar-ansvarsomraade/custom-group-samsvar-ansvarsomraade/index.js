// Global functions
import { instantiateComponent } from "../../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../../functions/helpers.js";

// Local functions
import {
    renderEmptyFieldText,
    renderHeaderElement,
    renderFunksjonElement,
    renderBeskrivelseElement,
    renderAnsvarsrettErklaertElement,
    renderArbeidetAvsluttetElement,
    renderAvdekketGjenstaaendePROElement,
    renderAvdekketGjenstaaendeUTFElement,
    renderGjenstaaendeArbeiderInnenforElement,
    renderGjenstaaendeArbeiderUtenforElement,
    renderTilstrekkeligSikkerhetElement,
    renderUtfoereInnenElement,
    renderTypeArbeiderElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-samsvar-ansvarsomraade",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
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

                this.appendChild(containerElement);
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
