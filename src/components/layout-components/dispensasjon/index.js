// Dependencies
import { appendChildren } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { renderLayoutContainerElement } from "../../../functions/helpers.js";

// Local functions
import {
    renderBegrunnelseFordeler,
    renderBegrunnelseHeader,
    renderBegrunnelseHensynBakBestemmelsen,
    renderBegrunnelseSamletBegrunnelse,
    renderBegrunnelseUlemper,
    renderBegrunnelseVurderingHensynBakBestemmelsen,
    renderBegrunnelseVurderingHensynOverordnet,
    renderBestemmelsestype,
    renderDispensasjonFraHeader,
    renderDispensasjonHeader,
    renderDispensasjonsbeskrivelse,
    renderDispensasjonsreferanse,
    renderEiendomByggestedElement,
    renderGenerelleVilkaarNorskSvenskDansk,
    renderGenerelleVilkaarNorskSvenskDanskHeader,
    renderKommunensSaksnummer,
    renderMetadataFtbId,
    renderNasjonalArealplanIdPlanIdentifikasjon,
    renderOensketVarighet,
    renderParagrafnummer,
    renderPlannavn,
    renderSoeknadGjelderHeader,
    renderStedfestingHeader,
    renderStedfestingPosisjonKoordinater,
    renderStedfestingPosisjonKoordinatsystem,
    renderStedfestingVertikalnivaa,
    renderTiltakshaver,
    renderTiltakshaverAdresse,
    renderTiltakshaverKontaktperson,
    renderTiltakshaverKontaktpersonAdresse,
    renderTiltakstyperHeader,
    renderTiltakstyperKode,
    renderVarighetHeader
} from "./renderers.js";

export default customElements.define(
    "custom-dispensasjon",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "layout",
                alwaysHideWhenEmpty: true,
                render: (host, component) => {
                    const layoutContainerElement = renderLayoutContainerElement();
                    const dispensasjonHeaderElement = renderDispensasjonHeader(component);
                    const dispensasjonsreferanseElement = renderDispensasjonsreferanse(component);
                    const metadataFtbIdElement = renderMetadataFtbId(component);
                    const kommunensSaksnummerElement = renderKommunensSaksnummer(component);
                    const soeknadGjelderHeaderElement = renderSoeknadGjelderHeader(component);
                    const eiendomByggestedElement = renderEiendomByggestedElement(component);
                    const tiltakstyperHeaderElement = renderTiltakstyperHeader(component);
                    const tiltakstyperKodeElement = renderTiltakstyperKode(component);
                    const tiltakshaverElement = renderTiltakshaver(component);
                    const tiltakshaverAdresseElement = renderTiltakshaverAdresse(component);
                    const tiltakshaverKontaktpersonElement = renderTiltakshaverKontaktperson(component);
                    const tiltakshaverKontaktpersonAdresseElement = renderTiltakshaverKontaktpersonAdresse(component);
                    const dispensasjonHeader2Element = renderDispensasjonHeader(component, "h2");
                    const dispensasjonsbeskrivelseElement = renderDispensasjonsbeskrivelse(component);
                    const dispensasjonFraHeaderElement = renderDispensasjonFraHeader(component);
                    const plannavnElement = renderPlannavn(component);
                    const nasjonalArealplanIdPlanIdentifikasjonElement = renderNasjonalArealplanIdPlanIdentifikasjon(component);
                    const bestemmelsestypeElement = renderBestemmelsestype(component);
                    const paragrafnummerElement = renderParagrafnummer(component);
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
                        eiendomByggestedElement,
                        tiltakstyperHeaderElement,
                        tiltakstyperKodeElement
                    ]);

                    // Tiltakshaver
                    appendChildren(layoutContainerElement, [
                        tiltakshaverElement,
                        tiltakshaverAdresseElement,
                        tiltakshaverKontaktpersonElement,
                        tiltakshaverKontaktpersonAdresseElement
                    ]);

                    // Dispensasjonsbeskrivelse
                    appendChildren(layoutContainerElement, [dispensasjonHeader2Element, dispensasjonsbeskrivelseElement]);

                    // Dispensasjon fra
                    appendChildren(layoutContainerElement, [
                        dispensasjonFraHeaderElement,
                        plannavnElement,
                        nasjonalArealplanIdPlanIdentifikasjonElement,
                        bestemmelsestypeElement,
                        paragrafnummerElement
                    ]);

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

                    host.appendChild(layoutContainerElement);
                }
            });
        }
    }
);
