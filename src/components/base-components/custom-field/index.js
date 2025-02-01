import {
    getComponentContainerElement,
    getCustomComponentProps,
    renderFieldElement
} from "../../../functions/helpers.js";

import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field",
    class extends HTMLElement {
        connectedCallback() {
            const { data, text, hideIfEmpty, inline, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const options = {
                    inline,
                    styleoverride
                };
                this.innerHTML = renderFieldElement(text, data, options);
            }
        }
    }
);
