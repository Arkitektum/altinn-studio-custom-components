// Dependencies
import { appendChildren } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { renderLayoutContainerElement } from "../../../functions/helpers.js";

// Local functions
import {
    renderBestemmelseHeader,
    renderBestemmelsestekst,
    renderDispVarselBeskrivelse,
    renderDispVarselBeskrivelseHeader,
    renderDispensasjonsvarselHeader,
    renderEmne,
    renderPlannavnParagrafnummer,
    renderSpoersmaalOmDispensasjonssoeknaden
} from "./renderers.js";

export default customElements.define(
    "custom-dispensasjonsvarsel",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "layout",
                alwaysHideWhenEmpty: true,
                render: (host, component) => {
                    const layoutContainerElement = renderLayoutContainerElement();
                    const dispensasjonsvarselHeaderElement = renderDispensasjonsvarselHeader(component);
                    const emneElement = renderEmne(component);
                    const bestemmelseHeaderElement = renderBestemmelseHeader(component);
                    const plannavnParagrafnummerElement = renderPlannavnParagrafnummer(component);
                    const bestemmelsestekstElement = renderBestemmelsestekst(component);
                    const dispVarselBeskrivelseHeaderElement = renderDispVarselBeskrivelseHeader(component);
                    const dispVarselBeskrivelseElement = renderDispVarselBeskrivelse(component);
                    const spoersmaalOmDispensasjonssoeknadenElement = renderSpoersmaalOmDispensasjonssoeknaden(component);

                    const validationFeedbackListElement = renderFeedbackListElement(component?.validationMessages);

                    // Intro
                    appendChildren(layoutContainerElement, [dispensasjonsvarselHeaderElement, emneElement]);

                    // Bestemmelse
                    appendChildren(layoutContainerElement, [bestemmelseHeaderElement, plannavnParagrafnummerElement, bestemmelsestekstElement]);

                    // Dispensasjonsvarsel beskrivelse
                    appendChildren(layoutContainerElement, [
                        dispVarselBeskrivelseHeaderElement,
                        dispVarselBeskrivelseElement,
                        spoersmaalOmDispensasjonssoeknadenElement
                    ]);

                    // Append the validation feedback list element if there are validation messages
                    appendChildren(layoutContainerElement, [validationFeedbackListElement]);

                    host.appendChild(layoutContainerElement);
                }
            });
        }
    }
);
