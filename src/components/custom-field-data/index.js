import { objectHasValue, renderFieldElement } from "../../functions/helpers.js";

customElements.define(
    "custom-field-data",
    class extends HTMLElement {
        connectedCallback() {
            const hideIfEmpty = this.getAttribute("hideIfEmpty") === "true";
            const hideTitle = this.getAttribute("hideTitle") === "true";
            const emptyFieldText = this.getAttribute("emptyFieldText");
            const formdata = JSON.parse(this.getAttribute("formdata"));
            const title = !hideTitle && this.getAttribute("text");
            const value = formdata?.simpleBinding?.length ? formdata.simpleBinding : emptyFieldText;
            if (hideIfEmpty && !objectHasValue(formdata.simpleBinding)) {
                this.style.display = "none";
            } else {
                this.innerHTML = renderFieldElement(title, value);
            }
        }
    }
);
