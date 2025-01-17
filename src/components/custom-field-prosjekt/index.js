import Prosjekt from "../../classes/Prosjekt.js";
import {
    getComponentContainerElement,
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement
} from "../../functions/helpers.js";
import { formatProsjekt } from "./functions.js";

export default customElements.define(
    "custom-field-prosjekt",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const prosjekt = new Prosjekt(data);
            if (hideIfEmpty && !objectHasValue(prosjekt) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const prosjektString = formatProsjekt(prosjekt);
                const value = prosjektString?.length ? prosjektString : emptyFieldText;
                this.innerHTML = renderFieldElement(title, value, true, styleoverride);
            }
        }
    }
);
