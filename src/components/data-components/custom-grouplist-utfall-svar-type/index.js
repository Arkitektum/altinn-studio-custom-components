import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import CustomElementHtmlAttributes from "../../../classes/system-classes/CustomElementHtmlAttributes.js";
import { createCustomElement, getComponentContainerElement, getComponentTexts, hasValue } from "../../../functions/helpers.js";
import { groupArrayItemsByUtfallType } from "./functions.js";

export default customElements.define(
    "custom-grouplist-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const dataGroupedByUtfallType = groupArrayItemsByUtfallType(component?.formData?.data);
            if (!hasValue(component?.formData?.data) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const texts = await getComponentTexts(this);
                component.setTexts(texts);
                for (const utfallType of Object.keys(dataGroupedByUtfallType)) {
                    component.setFormData({ data: dataGroupedByUtfallType[utfallType] });
                    component.setText(texts[`${utfallType?.toLowerCase()}.header`]);
                    const htmlAttributes = new CustomElementHtmlAttributes(component);
                    const utfallTypeElement = await createCustomElement("custom-group-utfall-svar-type", htmlAttributes);
                    this.appendChild(utfallTypeElement);
                }
            }
        }
    }
);
