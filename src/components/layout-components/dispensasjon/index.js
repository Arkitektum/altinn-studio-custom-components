import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";
import {
    getDispensasjon,
    renderDispansasjonHeader,
    renderDispensasjonReferanse,
    renderEiendomTable,
    renderKommunensSaksnummer,
    renderMetadataFtbId,
    renderSoeknadenGjelderHeader,
    renderTiltakshaverTable
} from "./functions.js";
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
            console.log(dispensasjon);
            if (!hasValue(dispensasjon) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const dispensasjonHeaderElement = renderDispansasjonHeader(dispensasjon);
                const dispensasjonsreferanseElement = renderDispensasjonReferanse(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const metadataFtbIdElement = renderMetadataFtbId(dispensasjon, textResources, textResourceBindings);
                const kommunensSaksnummerElement = renderKommunensSaksnummer(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );
                const soeknadenGjelderHeaderElement = renderSoeknadenGjelderHeader(textResources, textResourceBindings);
                const eiendomTableElement = renderEiendomTable(dispensasjon, textResources, textResourceBindings);
                const tiltakshaverTableElement = renderTiltakshaverTable(
                    dispensasjon,
                    textResources,
                    textResourceBindings
                );

                this.appendChild(dispensasjonHeaderElement);
                this.appendChild(dispensasjonsreferanseElement);
                this.appendChild(metadataFtbIdElement);
                this.appendChild(kommunensSaksnummerElement);
                this.appendChild(soeknadenGjelderHeaderElement);
                this.appendChild(eiendomTableElement);
                this.appendChild(tiltakshaverTableElement);
                this.appendChild(renderFeedbackListElement(validationMessages));
            }
        }
    }
);
