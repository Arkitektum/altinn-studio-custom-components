// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import UtfallSvarStatus from "../../../classes/data-classes/UtfallSvarStatus.js";

// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";

// Local functions
import { getStatusText } from "./functions.js";

export default customElements.define(
    "custom-field-utfall-svar-status",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const utfallSvarStatus = new UtfallSvarStatus(component?.formData?.data);
            const statusText = await getStatusText(utfallSvarStatus, this);
            if (component?.hideIfEmpty && !statusText?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                component.setFormData({ simpleBinding: statusText });
                const htmlAttributes = new CustomElementHtmlAttributes(component);
                this.innerHTML = createCustomElement("custom-field", htmlAttributes).outerHTML;
            }
        }
    }
);
