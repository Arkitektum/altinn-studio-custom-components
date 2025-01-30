import Prosjekt from "../../classes/Prosjekt";
import {
    getComponentContainerElement,
    getCustomComponentProps,
    objectHasValue,
    renderFieldElement
} from "../../functions/helpers";
import { formatProsjekt } from "./functions";

export default customElements.define(
    "custom-field-prosjekt",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, inline, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const prosjekt = new Prosjekt(data);
            if (hideIfEmpty && !objectHasValue(prosjekt) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const prosjektString = formatProsjekt(prosjekt);
                const value = prosjektString?.length ? prosjektString : emptyFieldText;
                const options = {
                    inline,
                    styleoverride
                };
                this.innerHTML = renderFieldElement(title, value, options);
            }
        }
    }
);
