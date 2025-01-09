import { objectHasValue, renderFieldElement } from "../../functions/helpers.js";

customElements.define(
    "custom-field-prosjekt",
    class extends HTMLElement {
        formatProsjekt(prosjekt) {
            const prosjektnrString = prosjekt?.prosjektnr?.length && `(${prosjekt.prosjektnr})`;
            const prosjektParts = [prosjekt?.prosjektnavn, prosjektnrString];
            return prosjektParts.filter((prosjektPart) => prosjektPart?.length).join(" ");
        }

        connectedCallback() {
            const hideIfEmpty = this.getAttribute("hideIfEmpty") === "true";
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const emptyFieldText = this.getAttribute("emptyFieldText");
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const title = !hideTitle && this.getAttribute("text");
            const prosjekt = { prosjektnavn: formdata.data.prosjektnavn, prosjektnr: formdata.data.prosjektnr };
            if (hideIfEmpty && !objectHasValue(prosjekt)) {
                this.style.display = "none";
            } else {
                const prosjektString = this.formatProsjekt(prosjekt);
                this.innerHTML = renderFieldElement(title, prosjektString?.length ? prosjektString : emptyFieldText);
            }
        }
    }
);
