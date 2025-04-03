import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { appendChildren, getComponentContainerElement, hasValue, renderLayoutContainerElement } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";
import { dispensasjonIsPlanBestemmelseType, getDispensasjon } from "./functions.js";
import {
    renderBestemmelserType,
    renderDispansasjonHeader,
    renderDispensasjonBeskrivelse,
    renderDispensasjonFraHeader,
    renderDispensasjonPlanBestemmelseNavn,
    renderDispensasjonReferanse,
    renderEiendomTable,
    renderInngangsbeskrivelse,
    renderKommunensSaksnummer,
    renderMetadataFtbId,
    renderNasjonalArealplanIdPlanIdentifikasjon,
    renderOensketVarighet,
    renderPlanBestemmelseNummerering,
    renderSoeknadenGjelderHeader,
    renderStedfestingHeader,
    renderStedfestingPosisjonKoordinater,
    renderStedfestingPosisjonKoordinatsystem,
    renderStedfestingVertikalnivaa,
    renderTiltakshaverAdresse,
    renderTiltakshaverTable,
    renderVarighetHeader
} from "./renderers.js";
import textResourceBindings from "./textResourceBindings.js";

export default customElements.define(
    "custom-dispensasjon",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const dispensasjon = getDispensasjon(component);
            const textResources = window.textResources;

            const validationMessages = hasMissingTextResources(textResources, textResourceBindings);
            if (!hasValue(dispensasjon) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const layoutContainerElement = renderLayoutContainerElement();
                const dispensasjonHeaderElement = renderDispansasjonHeader(dispensasjon);
                const dispensasjonsreferanseElement = renderDispensasjonReferanse(dispensasjon, textResources, textResourceBindings);
                const metadataFtbIdElement = renderMetadataFtbId(dispensasjon, textResources, textResourceBindings);
                const kommunensSaksnummerElement = renderKommunensSaksnummer(dispensasjon, textResources, textResourceBindings);
                const soeknadenGjelderHeaderElement = renderSoeknadenGjelderHeader(textResources, textResourceBindings);
                const eiendomTableElement = renderEiendomTable(dispensasjon, textResources, textResourceBindings);
                const tiltakshaverTableElement = renderTiltakshaverTable(dispensasjon, textResources, textResourceBindings);
                const tiltakshaverAdresseElement = renderTiltakshaverAdresse(dispensasjon, textResources, textResourceBindings);
                const dispensasjonHeader2Element = renderDispansasjonHeader(dispensasjon, "h2");
                const inngangsbeskrivelseElement = renderInngangsbeskrivelse(dispensasjon);
                const dispensasjonBeskrivelseElement = renderDispensasjonBeskrivelse(dispensasjon, textResources, textResourceBindings);
                const dispensasjonFraHeaderElement = renderDispensasjonFraHeader(textResources, textResourceBindings);
                const dispensasjonPlanBestemmelseNavnElement = renderDispensasjonPlanBestemmelseNavn(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const nasjonalArealplanIdPlanIdentifikasjonElement = renderNasjonalArealplanIdPlanIdentifikasjon(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const bestemmelserTypeElement = renderBestemmelserType(dispensasjon, textResources, textResourceBindings);
                const planBestemmelseNummereringElement = renderPlanBestemmelseNummerering(dispensasjon, textResources, textResourceBindings);
                const stedfestingHeaderElement = renderStedfestingHeader(textResources, textResourceBindings, "h2");
                const stedfestingPosisjonKoordinatsystemElement = renderStedfestingPosisjonKoordinatsystem(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const stedfestingPosisjonKoordinaterElement = renderStedfestingPosisjonKoordinater(dispensasjon, textResources, textResourceBindings);
                const stedfestingVertikalnivaaElement = renderStedfestingVertikalnivaa(dispensasjon, textResources, textResourceBindings);
                const varighetHeaderElement = renderVarighetHeader(textResources, textResourceBindings);
                const varighetOenskesVarigDispensasjonElement = renderOensketVarighet(dispensasjon, textResources, textResourceBindings);
                const validationFeedbackListElement = renderFeedbackListElement(validationMessages);

                // Intro
                appendChildren(layoutContainerElement, [
                    dispensasjonHeaderElement,
                    dispensasjonsreferanseElement,
                    metadataFtbIdElement,
                    kommunensSaksnummerElement
                ]);

                // Soeknaden gjelder
                appendChildren(layoutContainerElement, [soeknadenGjelderHeaderElement, eiendomTableElement]);

                // Soeker
                appendChildren(layoutContainerElement, [tiltakshaverTableElement, tiltakshaverAdresseElement]);

                // Dispensasjonsbeskrivelse
                appendChildren(layoutContainerElement, [dispensasjonHeader2Element, inngangsbeskrivelseElement, dispensasjonBeskrivelseElement]);

                // Dispensasjon fra
                if (dispensasjonIsPlanBestemmelseType(dispensasjon)) {
                    appendChildren(layoutContainerElement, [
                        dispensasjonFraHeaderElement,
                        dispensasjonPlanBestemmelseNavnElement,
                        nasjonalArealplanIdPlanIdentifikasjonElement,
                        bestemmelserTypeElement,
                        planBestemmelseNummereringElement
                    ]);
                } else {
                    appendChildren(layoutContainerElement, [dispensasjonFraHeaderElement, bestemmelserTypeElement]);
                }

                // Stedfesting
                appendChildren(layoutContainerElement, [
                    stedfestingHeaderElement,
                    stedfestingPosisjonKoordinatsystemElement,
                    stedfestingPosisjonKoordinaterElement,
                    stedfestingVertikalnivaaElement
                ]);

                // Varighet
                appendChildren(layoutContainerElement, [varighetHeaderElement, varighetOenskesVarigDispensasjonElement]);

                // Append the validation feedback list element if there are validation messages
                appendChildren(layoutContainerElement, [validationFeedbackListElement]);

                this.appendChild(layoutContainerElement);
            }
        }
    }
);
