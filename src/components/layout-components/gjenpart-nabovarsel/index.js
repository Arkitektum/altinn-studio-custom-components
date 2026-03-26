// Dependencies
import { appendChildren } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { getComponentContainerElement, renderLayoutContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import {
    renderDetErVarsletOmHeader,
    renderDispensasjonOversiktCounterElement,
    renderDispensasjonOversiktElement,
    renderDispensasjonOversiktHeaderElement,
    renderEiendomByggestedElement,
    renderGjenpartNabovarselHeader,
    renderGjenpartNabovarselSubHeader,
    renderKontaktpersonForNabovarseletElement,
    renderMetadataProsjektnavn,
    renderNaboGjenboerEiendom,
    renderPlanGjeldendePlanNavnElement,
    renderPlanerGjeldendePlanHeaderElement,
    renderPlanerGjeldendePlanPlantypeElement,
    renderSoekerElement,
    renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement,
    renderSoeknadGjelderBrukTiltaksformaalElement,
    renderSoeknadGjelderTypeElement
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

                const metadataProsjektnavnElement = renderMetadataProsjektnavn(component);
                const soekerElement = renderSoekerElement(component);

                const eiendomByggestedElement = renderEiendomByggestedElement(component);

                const detErVarsletOmHeaderElement = renderDetErVarsletOmHeader(component);
                const soeknadGjelderTypeElement = renderSoeknadGjelderTypeElement(component);
                const soeknadGjelderBrukTiltaksformaalElement = renderSoeknadGjelderBrukTiltaksformaalElement(component);
                const soeknadGjelderBrukBeskrivPlanlagtFormaalElement = renderSoeknadGjelderBrukBeskrivPlanlagtFormaalElement(component);

                const planerGjeldendePlanHeaderElement = renderPlanerGjeldendePlanHeaderElement(component);
                const planerGjeldendePlanNavnElement = renderPlanGjeldendePlanNavnElement(component);
                const planerGjeldendePlanPlantypeElement = renderPlanerGjeldendePlanPlantypeElement(component);

                const dispensajonOversiktHeaderElement = renderDispensasjonOversiktHeaderElement(component);
                const dispensasjonOversiktCountElement = renderDispensasjonOversiktCounterElement(component);
                const dispensasjonOversiktElement = renderDispensasjonOversiktElement(component);

                const kontaktpersonForNabovarseletElement = renderKontaktpersonForNabovarseletElement(component);

                const naboGjenboerEiendomElement = renderNaboGjenboerEiendom(component);

                const validationFeedbackListElement = renderFeedbackListElement(component?.validationMessages);

                // Header and subheader
                appendChildren(layoutContainerElement, [headerElement, subHeaderElement]);

                // Metadata
                appendChildren(layoutContainerElement, [metadataProsjektnavnElement, soekerElement]);

                // Eiendom og byggested
                appendChildren(layoutContainerElement, [eiendomByggestedElement]);

                // Det er varslet om
                appendChildren(layoutContainerElement, [
                    detErVarsletOmHeaderElement,
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

                // Dispensasjonsoversikt
                appendChildren(layoutContainerElement, [
                    dispensajonOversiktHeaderElement,
                    dispensasjonOversiktCountElement,
                    dispensasjonOversiktElement
                ]);

                // Kontaktperson for nabovarselet
                appendChildren(layoutContainerElement, [kontaktpersonForNabovarseletElement]);

                // Nabovarsel med vedlegg er sendt til følgende naboer
                appendChildren(layoutContainerElement, [naboGjenboerEiendomElement]);

                // Append the validation feedback list element if there are validation messages
                appendChildren(layoutContainerElement, [validationFeedbackListElement]);

                this.appendChild(layoutContainerElement);
            }
        }
    }
);
