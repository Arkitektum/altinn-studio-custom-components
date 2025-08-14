// Classes
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";

// Global functions
import { createCustomElement, getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";

export default customElements.define(
    "custom-field-list-data",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                component.resourceValues?.data?.forEach((fieldItem) => {
                    const htmlAttributes = new CustomElementHtmlAttributes({
                        ...fieldItem,
                        resourceValues: {
                            data: fieldItem.data,
                            title: fieldItem.title
                        }
                    });
                    const fieldItemElement = createCustomElement("custom-field", htmlAttributes).outerHTML;
                    this.innerHTML += fieldItemElement;
                });
            }
        }
    }
);
