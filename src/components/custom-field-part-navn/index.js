import Part from "../../classes/Part.js";
import { getCustomComponentProps, objectHasValue, renderFieldElement } from "../../functions/helpers.js";
import { formatName } from "./functions.js";

export default customElements.define(
    "custom-field-part-navn",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const hideOrgNr = this.getAttribute("hideOrgNr") === "true"
            const part = new Part(data);
            if (hideIfEmpty && !objectHasValue(part)) {
                this.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const name = formatName(part, hideOrgNr);
                this.innerHTML = renderFieldElement(
                    title,
                    name?.length ? name : emptyFieldText,
                    true,
                    styleoverride
                );
            }
        }
    }
);
