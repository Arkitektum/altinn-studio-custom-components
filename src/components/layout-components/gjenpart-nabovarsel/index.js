// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { appendChildren, getComponentContainerElement, renderLayoutContainerElement } from "../../../functions/helpers.js";

// Local functions
import {
    renderAnsvarligSoekerElement,
    renderDetVarslesHervedOmHeader,
    renderEiendomByggestedElement,
    renderGjenpartNabovarselHeader,
    renderGjenpartNabovarselSubHeader,
    renderKontaktpersonForNabovarseletElement,
    renderMerknaderSendesTilHeaderElement,
    renderNaboGjenboerEiendom,
    renderPlanerGjeldendePlanHeaderElement,
    renderPlanerGjeldendePlanPlantypeElement,
    renderPlanGjeldendePlanNavnElement,
    renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement,
    renderSoeknadGjelderBrukTiltaksformaalElement,
    renderSoeknadGjelderHeader,
    renderSoeknadGjelderTypeElement,
    renderSpoersmaalRettesTilHeaderElement,
    renderTiltakshaverElement
} from "./renderers.js";

export default customElements.define(
    "custom-gjenpart-nabovarsel",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);

            if (component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const layoutContainerElement = renderLayoutContainerElement();

                const headerElement = renderGjenpartNabovarselHeader(component, "h1");
                const subHeaderElement = renderGjenpartNabovarselSubHeader(component);

                const soeknadGjelderHeaderElement = renderSoeknadGjelderHeader(component);
                const eiendomByggestedElement = renderEiendomByggestedElement(component);

                const detVarslesHervedOmHeaderElement = renderDetVarslesHervedOmHeader(component);
                const soeknadGjelderTypeElement = renderSoeknadGjelderTypeElement(component);
                const soeknadGjelderBrukTiltaksformaalElement = renderSoeknadGjelderBrukTiltaksformaalElement(component);
                const soeknadGjelderBrukBeskrivPlanlagtFormaalElement = renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement(component);

                const planerGjeldendePlanHeaderElement = renderPlanerGjeldendePlanHeaderElement(component);
                const planerGjeldendePlanNavnElement = renderPlanGjeldendePlanNavnElement(component);
                const planerGjeldendePlanPlantypeElement = renderPlanerGjeldendePlanPlantypeElement(component);

                const merknaderSendesTilHeaderElement = renderMerknaderSendesTilHeaderElement(component);
                const kontaktpersonForNabovarseletElement = renderKontaktpersonForNabovarseletElement(component);
                const ansvarligSoekerElement = renderAnsvarligSoekerElement(component);
                const tiltakshaverElement = renderTiltakshaverElement(component);

                const spoersmaalRettesTilHeaderElement = renderSpoersmaalRettesTilHeaderElement(component);

                const naboGjenboerEiendomElement = renderNaboGjenboerEiendom(component);

                const validationFeedbackListElement = renderFeedbackListElement(component?.validationMessages);

                // Header and subheader
                appendChildren(layoutContainerElement, [headerElement, subHeaderElement]);

                // Søknad gjelder
                appendChildren(layoutContainerElement, [soeknadGjelderHeaderElement, eiendomByggestedElement]);

                // Det varsles herved om
                appendChildren(layoutContainerElement, [
                    detVarslesHervedOmHeaderElement,
                    soeknadGjelderTypeElement,
                    soeknadGjelderBrukTiltaksformaalElement,
                    soeknadGjelderBrukBeskrivPlanlagtFormaalElement
                ]);

                // Gjeldende plan
                appendChildren(layoutContainerElement, [
                    planerGjeldendePlanHeaderElement,
                    planerGjeldendePlanNavnElement,
                    planerGjeldendePlanPlantypeElement
                ]);

                // Spørsmål vedrørende nabovarsel rettes til
                appendChildren(layoutContainerElement, [spoersmaalRettesTilHeaderElement, kontaktpersonForNabovarseletElement]);

                // Merknader sendes til
                appendChildren(layoutContainerElement, [
                    merknaderSendesTilHeaderElement,
                    ansvarligSoekerElement,
                    tiltakshaverElement,
                    naboGjenboerEiendomElement
                ]);

                // Append the validation feedback list element if there are validation messages
                appendChildren(layoutContainerElement, [validationFeedbackListElement]);

                this.appendChild(layoutContainerElement);
            }
        }
    }
);
