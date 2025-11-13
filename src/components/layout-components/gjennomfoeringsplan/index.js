// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { appendChildren, getComponentContainerElement, renderLayoutContainerElement } from "../../../functions/helpers.js";
import { setPageOrientation } from "../../../functions/printHelpers.js";

// Local functions
import {
    renderAnsvarligSoeker,
    renderAnsvarsomraade,
    renderEiendomByggested,
    renderGjennomfoeringsplanHeader,
    renderGjennomfoeringsplanSubHeader,
    renderKommunensSaksnummer,
    renderMetadataFtbId,
    renderMetadataProsjektnavn,
    renderPlanenGjelderHeader,
    renderVersjon
} from "./renderers.js";

export default customElements.define(
    "custom-gjennomfoeringsplan",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);

            setPageOrientation("landscape");

            if (component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const layoutContainerElement = renderLayoutContainerElement();

                const headerElement = renderGjennomfoeringsplanHeader(component, "h1");
                const subHeaderElement = renderGjennomfoeringsplanSubHeader(component);

                const versjonElement = renderVersjon(component);
                const kommunensSaksnummerElement = renderKommunensSaksnummer(component);
                const metadataProsjektnavnElement = renderMetadataProsjektnavn(component);
                const metadataFtbIdElement = renderMetadataFtbId(component);

                const planenGjelderHeaderElement = renderPlanenGjelderHeader(component);
                const eiendomByggestedElement = renderEiendomByggested(component);
                const ansvarligSoekerElement = renderAnsvarligSoeker(component);
                const ansvarsomraadeElement = renderAnsvarsomraade(component);

                const validationFeedbackListElement = renderFeedbackListElement(component?.validationMessages);

                // Header and subheader
                appendChildren(layoutContainerElement, [headerElement, subHeaderElement]);

                // Intro
                appendChildren(layoutContainerElement, [
                    versjonElement,
                    kommunensSaksnummerElement,
                    metadataProsjektnavnElement,
                    metadataFtbIdElement
                ]);

                // Planen gjelder
                appendChildren(layoutContainerElement, [
                    planenGjelderHeaderElement,
                    eiendomByggestedElement,
                    ansvarligSoekerElement,
                    ansvarsomraadeElement
                ]);

                // Append the validation feedback list element if there are validation messages
                appendChildren(layoutContainerElement, [validationFeedbackListElement]);

                this.appendChild(layoutContainerElement);
            }
        }
    }
);
