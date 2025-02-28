import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";
import {
    getGjennomfoeringsplanData,
    renderEiendomTable,
    renderFeedbackListElement,
    renderGjenomfoeringsplanNummer
} from "./functions.js";
import textResourceBindings from "./textResourceBindings.js";

export default customElements.define(
    "custom-gjennomfoeringsplan",
    class extends HTMLElement {
        async connectedCallback() {
            const textResources = JSON.parse(this.getAttribute("textResources"));
            const gjennomfoeringsplan = getGjennomfoeringsplanData(this);
            const validationMessages = hasMissingTextResources(textResources, textResourceBindings);
            const componentContainerElement = getComponentContainerElement(this);
            if (!hasValue(gjennomfoeringsplan) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const gjennomfoeringsplanNummerElement = renderGjenomfoeringsplanNummer(
                    gjennomfoeringsplan,
                    textResources
                );
                const eiendomTableElement = renderEiendomTable(
                    gjennomfoeringsplan?.eiendomByggested?.eiendom,
                    textResources
                );
                const feebackListElement = renderFeedbackListElement(validationMessages);
                this.appendChild(gjennomfoeringsplanNummerElement);
                this.appendChild(eiendomTableElement);
                this.appendChild(feebackListElement);
            }
        }
    }
);
