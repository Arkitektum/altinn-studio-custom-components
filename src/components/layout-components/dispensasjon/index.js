import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue, renderLayoutContainerElement } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";
import {
    getDispensasjon,
    renderDispansasjonHeader,
    renderDispensasjonBeskrivelse,
    renderDispensasjonReferanse,
    renderEiendomTable,
    renderInngangsbeskrivelse,
    renderKommunensSaksnummer,
    renderMetadataFtbId,
    renderSoeknadenGjelderHeader,
    renderTiltakshaverAdresse,
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

                layoutContainerElement.appendChild(dispensasjonHeaderElement);
                layoutContainerElement.appendChild(dispensasjonsreferanseElement);
                layoutContainerElement.appendChild(metadataFtbIdElement);
                layoutContainerElement.appendChild(kommunensSaksnummerElement);
                layoutContainerElement.appendChild(soeknadenGjelderHeaderElement);
                layoutContainerElement.appendChild(eiendomTableElement);
                layoutContainerElement.appendChild(tiltakshaverTableElement);
                layoutContainerElement.appendChild(tiltakshaverAdresseElement);
                layoutContainerElement.appendChild(dispensasjonHeader2Element);
                layoutContainerElement.appendChild(inngangsbeskrivelseElement);
                layoutContainerElement.appendChild(dispensasjonBeskrivelseElement);
                layoutContainerElement.appendChild(renderFeedbackListElement(validationMessages));

                this.appendChild(layoutContainerElement);
            }
        }
    }
);
