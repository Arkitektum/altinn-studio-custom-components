import {
    addContainerElement,
    createCustomElement,
    getCustomComponentProps,
    hasValue
} from "../../../../functions/helpers.js";

export default customElements.define(
    "custom-group-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const { formData, text } = getCustomComponentProps(this);
            const texts = JSON.parse(this.getAttribute("texts"));
            if (hasValue(formData?.data)) {
                const headerElement = createCustomElement("custom-header-text", {
                    text,
                    size: "h2"
                });
                this.appendChild(headerElement);
                const utfallSvarListElement = await createCustomElement(
                    "custom-grouplist-utfall-svar",
                    {
                        formData,
                        texts
                    },
                    false
                );
                this.appendChild(utfallSvarListElement);
            }
        }
    }
);
