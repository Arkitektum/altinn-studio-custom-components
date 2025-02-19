import {
    addStyle,
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps,
    hasValue
} from "../../../../../functions/helpers.js";

export default customElements.define(
    "custom-grouplist-utfall-svar",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, hideIfEmpty } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const texts = JSON.parse(this.getAttribute("texts"));
            if (hideIfEmpty && !hasValue(formData?.data) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                for (const utfallSvar of formData.data) {
                    const utfallSvarElement = createCustomElement("custom-group-utfall-svar", {
                        formData: {data: utfallSvar},
                        hideIfEmpty: true,
                        texts
                    });
                    this.appendChild(utfallSvarElement);
                    const dividerElement = createCustomElement("custom-divider");
                    this.appendChild(dividerElement);
                }
            }
        }
    }
);
