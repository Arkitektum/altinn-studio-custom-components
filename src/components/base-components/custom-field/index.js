import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { renderFieldElement } from "./functions.js";
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-field",
    class extends HTMLElement {
        connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const value = component?.formData?.simpleBinding;
            if (component?.hideIfEmpty && !value && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const options = {
                    inline: component?.inline,
                    styleOverride: component?.styleOverride
                };
                this.innerHTML = renderFieldElement(component?.text, value, options);
            }
        }
    }
);
