import {
    addGlobalStylesheet,
    getComponentContainerElement,
    getCustomComponentProps,
    renderFieldElement
} from "../../functions/helpers.js";

import styles from "./styles.css" with { type: 'css' };

export default customElements.define(
    "custom-field",
    class extends HTMLElement {
        connectedCallback() {
            addGlobalStylesheet("custom-field-styles", styles);
            const { data, text, hideIfEmpty, inline, styleoverride } =
                getCustomComponentProps(this);
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
