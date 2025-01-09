import Prosjekt from "../../classes/Prosjekt.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";

export default customElements.define(
    "custom-field-prosjekt",
    class extends HTMLElement {
        formatProsjekt(prosjekt) {
            const prosjektnrString = prosjekt?.prosjektnr?.length && `(${prosjekt.prosjektnr})`;
            const prosjektParts = [prosjekt?.prosjektnavn, prosjektnrString];
            return prosjektParts.filter((prosjektPart) => prosjektPart?.length).join(" ");
        }
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const prosjekt = new Prosjekt(data);
            if (hideIfEmpty && !objectHasValue(prosjekt)) {
                this.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const prosjektString = this.formatProsjekt(prosjekt);
                const value = prosjektString?.length ? prosjektString : emptyFieldText;
                this.innerHTML = renderFieldElement(title, value, true, styleoverride);
            }
        }
    }
);
