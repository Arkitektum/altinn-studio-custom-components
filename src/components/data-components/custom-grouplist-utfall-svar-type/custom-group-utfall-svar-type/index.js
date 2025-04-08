// Classes
import CustomComponent from "../../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, hasValue } from "../../../../functions/helpers.js";

export default customElements.define(
    "custom-group-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            if (hasValue(component?.formData?.data)) {
                const headerHtmlAttributes = new CustomElementHtmlAttributes({
                    text: component?.text,
                    size: "h2"
                });
                const headerElement = createCustomElement("custom-header-text", headerHtmlAttributes);
                this.appendChild(headerElement);
                const utfallSvarHtmlAttributes = new CustomElementHtmlAttributes({
                    formData: component?.formData,
                    texts: component?.texts
                });
                const utfallSvarListElement = await createCustomElement("custom-grouplist-utfall-svar", utfallSvarHtmlAttributes);
                this.appendChild(utfallSvarListElement);
            }
        }
    }
);
