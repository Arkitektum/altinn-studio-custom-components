import { getComponentContainerElement, getCustomComponentProps } from "../../../functions/helpers.js";
import { renderFieldElement } from "./functions.js";

import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field",
    class extends HTMLElement {
        connectedCallback() {
            const { formData, text, hideIfEmpty, inline, styleOverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const value = formData?.simpleBinding;
            if (hideIfEmpty && !value && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const options = {
                    inline,
                    styleOverride
                };
                this.innerHTML = renderFieldElement(text, value, options);
            }
        }
    }
);
