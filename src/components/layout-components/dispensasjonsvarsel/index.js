// Classes
import { instantiateComponent } from "../../../functions/componentHelpers.js";

// Global functions
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { appendChildren, getComponentContainerElement, renderLayoutContainerElement } from "../../../functions/helpers.js";

// Local functions
import {
    renderDispensasjonsvarselHeader,
    renderEmne,
    renderBestemmelseHeader,
    renderPlannavnParagrafnummer,
    renderBestemmelsestekst,
    renderDispVarselBeskrivelseHeader,
    renderDispVarselBeskrivelse,
    renderSpoersmaalOmDispensasjonssoeknaden
} from "./renderers.js";

export default customElements.define(
    "custom-dispensasjonsvarsel",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);

            if (component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
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

                this.appendChild(layoutContainerElement);
            }
        }
    }
);
