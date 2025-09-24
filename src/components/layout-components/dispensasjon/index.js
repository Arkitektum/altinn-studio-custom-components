// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { appendChildren, getComponentContainerElement, hasValue, renderLayoutContainerElement } from "../../../functions/helpers.js";

// Local functions
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
    renderAnsvarligSoekerTable,
    renderAnsvarligSoekerAdresse,
    renderTiltakstyperTypeHeader,
    renderTiltakstyperTypeKode,
    renderVarighetHeader
} from "./renderers.js";

export default customElements.define(
    "custom-dispensasjon",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);

            if (component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const layoutContainerElement = renderLayoutContainerElement();
                const dispensasjonHeaderElement = renderDispansasjonHeader(component);
                const dispensasjonsreferanseElement = renderDispensasjonReferanse(component);
                const metadataFtbIdElement = renderMetadataFtbId(component);
                const kommunensSaksnummerElement = renderKommunensSaksnummer(component);
                const soeknadGjelderHeaderElement = renderSoeknadGjelderHeader(component);
                const eiendomTableElement = renderEiendomTable(component);
                const tiltakstyperTypeHeaderElement = renderTiltakstyperTypeHeader(component);
                const tiltakstyperTypeKodeElement = renderTiltakstyperTypeKode(component);
                const tiltakshaverTableElement = renderTiltakshaverTable(component);
                const tiltakshaverAdresseElement = renderTiltakshaverAdresse(component);
                const ansvarligSoekerTableElement = renderAnsvarligSoekerTable(component);
                const ansvarligSoekerAdresseElement = renderAnsvarligSoekerAdresse(component);
                const dispensasjonHeader2Element = renderDispansasjonHeader(component, "h2");
                const inngangsbeskrivelseElement = renderInngangsbeskrivelse(component);
                const dispensasjonBeskrivelseElement = renderDispensasjonBeskrivelse(component);
                const dispensasjonFraHeaderElement = renderDispensasjonFraHeader(component);
                const dispensasjonPlanBestemmelseNavnElement = renderDispensasjonPlanBestemmelseNavn(component);
                const nasjonalArealplanIdPlanIdentifikasjonElement = renderNasjonalArealplanIdPlanIdentifikasjon(component);
                const bestemmelserTypeElement = renderBestemmelserType(component);
                const planBestemmelseNummereringElement = renderPlanBestemmelseNummerering(component);
                const stedfestingHeaderElement = renderStedfestingHeader(component);
                const stedfestingPosisjonKoordinatsystemElement = renderStedfestingPosisjonKoordinatsystem(component);
                const stedfestingPosisjonKoordinaterElement = renderStedfestingPosisjonKoordinater(component);
                const stedfestingVertikalnivaaElement = renderStedfestingVertikalnivaa(component);
                const varighetHeaderElement = renderVarighetHeader(component);
                const varighetOenskesVarigDispensasjonElement = renderOensketVarighet(component);
                const begrunnelseHeaderElement = renderBegrunnelseHeader(component);
                const begrunnelseHensynBakBestemmelsenElement = renderBegrunnelseHensynBakBestemmelsen(component);
                const begrunnelseVurderingHensynBakBestemmelsenElement = renderBegrunnelseVurderingHensynBakBestemmelsen(component);
                const begrunnelseVurderingHensynOverordnetElement = renderBegrunnelseVurderingHensynOverordnet(component);
                const begrunnelseFordelerElement = renderBegrunnelseFordeler(component);
                const begrunnelseUlemperElement = renderBegrunnelseUlemper(component);
                const begrunnelseSamletBegrunnelseElement = renderBegrunnelseSamletBegrunnelse(component);
                const generelleVilkaarNorskSvenskDanskHeaderElement = renderGenerelleVilkaarNorskSvenskDanskHeader(component);
                const renderedGenerelleVilkaarNorskSvenskDanskElement = renderGenerelleVilkaarNorskSvenskDansk(component);

                const validationFeedbackListElement = renderFeedbackListElement(component?.validationMessages);

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
                if (hasValue(component?.resourceValues?.data?.ansvarligSoeker)) {
                    appendChildren(layoutContainerElement, [ansvarligSoekerTableElement, ansvarligSoekerAdresseElement]);
                } else if (hasValue(component?.resourceValues?.data?.tiltakshaver)) {
                    appendChildren(layoutContainerElement, [tiltakshaverTableElement, tiltakshaverAdresseElement]);
                }

                // Dispensasjonsbeskrivelse
                appendChildren(layoutContainerElement, [dispensasjonHeader2Element, inngangsbeskrivelseElement, dispensasjonBeskrivelseElement]);

                // Dispensasjon fra
                if (component.isPlanBestemmelseType) {
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
