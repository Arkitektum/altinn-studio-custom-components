// Dependencies
import { appendChildren } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { renderLayoutContainerElement } from "../../../functions/helpers.js";
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
        connectedCallback() {
            // Runs unconditionally (on both the hidden and rendered paths), so it stays outside the helper.
            setPageOrientation("landscape");
            renderCustomComponent(this, {
                type: "layout",
                alwaysHideWhenEmpty: true,
                render: (host, component) => {
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

                    host.appendChild(layoutContainerElement);
                }
            });
        }
    }
);
