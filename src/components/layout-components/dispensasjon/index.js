// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

// Global functions
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { appendChildren, getComponentContainerElement, hasValue, renderLayoutContainerElement } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

// Local functions
import { dispensasjonIsPlanBestemmelseType, getDispensasjon } from "./functions.js";
import {
    renderBegrunnelseFordeler,
    renderBegrunnelseHeader,
    renderBegrunnelseHensynBakBestemmelsen,
    renderBegrunnelseSamletBegrunnelse,
    renderBegrunnelseUlemper,
    renderBegrunnelseVurderingHensynBakBestemmelsen,
    renderBegrunnelseVurderingHensynOverordnet,
    renderBestemmelserType,
    renderDispansasjonHeader,
    renderDispensasjonBeskrivelse,
    renderDispensasjonFraHeader,
    renderDispensasjonPlanBestemmelseNavn,
    renderDispensasjonReferanse,
    renderEiendomTable,
    renderGenerelleVilkaarNorskSvenskDansk,
    renderGenerelleVilkaarNorskSvenskDanskHeader,
    renderInngangsbeskrivelse,
    renderKommunensSaksnummer,
    renderMetadataFtbId,
    renderNasjonalArealplanIdPlanIdentifikasjon,
    renderOensketVarighet,
    renderPlanBestemmelseNummerering,
    renderSoeknadGjelderHeader,
    renderStedfestingHeader,
    renderStedfestingPosisjonKoordinater,
    renderStedfestingPosisjonKoordinatsystem,
    renderStedfestingVertikalnivaa,
    renderTiltakshaverAdresse,
    renderTiltakshaverTable,
    renderTiltakstyperTypeHeader,
    renderTiltakstyperTypeKode,
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
                const soeknadGjelderHeaderElement = renderSoeknadGjelderHeader(textResources, textResourceBindings);
                const eiendomTableElement = renderEiendomTable(dispensasjon, textResources, textResourceBindings);
                const tiltakstyperTypeHeaderElement = renderTiltakstyperTypeHeader(textResources, textResourceBindings);
                const tiltakstyperTypeKodeElement = renderTiltakstyperTypeKode(dispensasjon, textResources, textResourceBindings);
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
                const stedfestingHeaderElement = renderStedfestingHeader(textResources, textResourceBindings);
                const stedfestingPosisjonKoordinatsystemElement = renderStedfestingPosisjonKoordinatsystem(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const stedfestingPosisjonKoordinaterElement = renderStedfestingPosisjonKoordinater(dispensasjon, textResources, textResourceBindings);
                const stedfestingVertikalnivaaElement = renderStedfestingVertikalnivaa(dispensasjon, textResources, textResourceBindings);
                const varighetHeaderElement = renderVarighetHeader(textResources, textResourceBindings);
                const varighetOenskesVarigDispensasjonElement = renderOensketVarighet(dispensasjon, textResources, textResourceBindings);
                const begrunnelseHeaderElement = renderBegrunnelseHeader(textResources, textResourceBindings);
                const begrunnelseHensynBakBestemmelsenElement = renderBegrunnelseHensynBakBestemmelsen(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const begrunnelseVurderingHensynBakBestemmelsenElement = renderBegrunnelseVurderingHensynBakBestemmelsen(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const begrunnelseVurderingHensynOverordnetElement = renderBegrunnelseVurderingHensynOverordnet(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const begrunnelseFordelerElement = renderBegrunnelseFordeler(dispensasjon, textResources, textResourceBindings);
                const begrunnelseUlemperElement = renderBegrunnelseUlemper(dispensasjon, textResources, textResourceBindings);
                const begrunnelseSamletBegrunnelseElement = renderBegrunnelseSamletBegrunnelse(dispensasjon, textResources, textResourceBindings);
                const generelleVilkaarNorskSvenskDanskHeaderElement = renderGenerelleVilkaarNorskSvenskDanskHeader(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const renderedGenerelleVilkaarNorskSvenskDanskElement = renderGenerelleVilkaarNorskSvenskDansk(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );

                const validationFeedbackListElement = renderFeedbackListElement(validationMessages);

                // Intro
                appendChildren(layoutContainerElement, [
                    dispensasjonHeaderElement,
                    dispensasjonsreferanseElement,
                    metadataFtbIdElement,
                    kommunensSaksnummerElement
                ]);

                // Soeknad gjelder
                appendChildren(layoutContainerElement, [
                    soeknadGjelderHeaderElement,
                    eiendomTableElement,
                    tiltakstyperTypeHeaderElement,
                    tiltakstyperTypeKodeElement
                ]);

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

                // Begrunnelse
                appendChildren(layoutContainerElement, [
                    begrunnelseHeaderElement,
                    begrunnelseHensynBakBestemmelsenElement,
                    begrunnelseVurderingHensynBakBestemmelsenElement,
                    begrunnelseVurderingHensynOverordnetElement,
                    begrunnelseFordelerElement,
                    begrunnelseUlemperElement,
                    begrunnelseSamletBegrunnelseElement
                ]);

                // Erklaering
                appendChildren(layoutContainerElement, [
                    generelleVilkaarNorskSvenskDanskHeaderElement,
                    renderedGenerelleVilkaarNorskSvenskDanskElement
                ]);

                // Append the validation feedback list element if there are validation messages
                appendChildren(layoutContainerElement, [validationFeedbackListElement]);

                this.appendChild(layoutContainerElement);
            }
        }
    }
);
