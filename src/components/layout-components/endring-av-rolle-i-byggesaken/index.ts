// Dependencies
import { appendChildren } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.ts";
import { renderLayoutContainerElement } from "../../../functions/helpers.ts";

// Local functions
import {
    renderEiendomByggestedElement,
    renderEndringAvRolleIByggesakenHeader,
    renderEndringMeldtAv,
    renderEndringMeldtAvAdresse,
    renderEndringMeldtAvKontaktperson,
    renderGjelderFraDato,
    renderKommunensSaksnummer,
    renderRolleendringerElement,
    renderSoeknadGjelderBrukTiltaksformaalElement,
    renderSoeknadGjelderHeader,
    renderSoeknadGjelderTypeElement
} from "./renderers.ts";

export default customElements.define(
    "custom-endring-av-rolle-i-byggesaken",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "layout",
                render: (host, component) => {
                    const layoutContainerElement = renderLayoutContainerElement();

                    const headerElement = renderEndringAvRolleIByggesakenHeader(component, "h1");

                    const kommunensSaksnummerElement = renderKommunensSaksnummer(component);
                    const gjelderFraDatoElement = renderGjelderFraDato(component);

                    const soeknadGjelderHeaderElement = renderSoeknadGjelderHeader(component);
                    const eiendomByggestedElement = renderEiendomByggestedElement(component);
                    const soeknadGjelderTypeElement = renderSoeknadGjelderTypeElement(component);
                    const soeknadGjelderBrukTiltaksformaalElement = renderSoeknadGjelderBrukTiltaksformaalElement(component);

                    const rolleendringerElement = renderRolleendringerElement(component);

                    const endringMeldtAvElement = renderEndringMeldtAv(component);
                    const endringMeldtAvAdresseElement = renderEndringMeldtAvAdresse(component);
                    const endringMeldtAvKontaktpersonElement = renderEndringMeldtAvKontaktperson(component);

                    const validationFeedbackListElement = renderFeedbackListElement(component?.validationMessages);

                    // Header
                    appendChildren(layoutContainerElement, [headerElement]);

                    // Kommunens saksnummer and the date the change applies from
                    appendChildren(layoutContainerElement, [kommunensSaksnummerElement, gjelderFraDatoElement]);

                    // Søknaden gjelder
                    appendChildren(layoutContainerElement, [
                        soeknadGjelderHeaderElement,
                        eiendomByggestedElement,
                        soeknadGjelderTypeElement,
                        soeknadGjelderBrukTiltaksformaalElement
                    ]);

                    // Rolleendringer
                    appendChildren(layoutContainerElement, [rolleendringerElement]);

                    // Endring meldt av
                    appendChildren(layoutContainerElement, [endringMeldtAvElement, endringMeldtAvAdresseElement, endringMeldtAvKontaktpersonElement]);

                    // Append the validation feedback list element if there are validation messages
                    appendChildren(layoutContainerElement, [validationFeedbackListElement]);

                    host.appendChild(layoutContainerElement);
                }
            });
        }
    }
);
