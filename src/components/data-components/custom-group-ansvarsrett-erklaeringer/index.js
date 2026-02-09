// Global functions
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";

// Local functions
import {
    renderHeaderElement,
    renderErklaeringTekstElement,
    renderSOEKTekstElement,
    renderPROTekstElement,
    renderUTFTekstElement,
    renderKONTROLLTekstElement,
    renderEmptyFieldText
} from "./renderers.js";

export default customElements.define(
    "custom-group-ansvarsrett-erklaeringer",
    class extends HTMLElement {
        async connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            let funksjonList = [];
            if (component.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                if (hasValue(component?.resourceBindings?.erklaeringer?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceBindings?.erklaeringer?.title, component?.size));
                }
                if (component?.isEmpty) {
                    const emptyFieldTextElement = renderEmptyFieldText(component);
                    this.appendChild(emptyFieldTextElement);
                } else {
                    component.resourceValues?.data?.forEach((element) => {
                        funksjonList.push(element.funksjon?.kodeverdi?.toUpperCase());
                    });
                    const harErklaeringAnsvarligProsjekterende =
                        component?.resourceValues?.simpleBinding?.harErklaeringAnsvarligProsjekterende === true ||
                        component?.resourceValues?.simpleBinding?.harErklaeringAnsvarligProsjekterende === "true";

                    const harErklaeringAnsvarligUtfoerende =
                        component?.resourceValues?.simpleBinding?.harErklaeringAnsvarligUtfoerende === true ||
                        component?.resourceValues?.simpleBinding?.harErklaeringAnsvarligUtfoerende === "true";

                    const harErklaeringAnsvarligKontrollerende =
                        component?.resourceValues?.simpleBinding?.harErklaeringAnsvarligKontrollerende === true ||
                        component?.resourceValues?.simpleBinding?.harErklaeringAnsvarligKontrollerende === "true";

                    this.appendChild(renderErklaeringTekstElement(component));

                    this.appendChild(renderSOEKTekstElement(component));

                    if (funksjonList.includes("PRO") && harErklaeringAnsvarligProsjekterende) {
                        this.appendChild(renderPROTekstElement(component));
                    }
                    if (funksjonList.includes("UTF") && harErklaeringAnsvarligUtfoerende) {
                        this.appendChild(renderUTFTekstElement(component));
                    }
                    if (funksjonList.includes("KONTROLL") && harErklaeringAnsvarligKontrollerende) {
                        this.appendChild(renderKONTROLLTekstElement(component));
                    }
                }
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
