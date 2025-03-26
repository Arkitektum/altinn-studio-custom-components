import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";
import { getEiendomList, renderEiendomTable } from "./functions.js";
import textResourceBindings from "./textResourceBindings.js";

export default customElements.define(
    "custom-table-eiendom",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const eiendomList = getEiendomList(component);
            const textResources = window.textResources;
            const validationMessages = hasMissingTextResources(textResources, textResourceBindings);
            if (component?.hideIfEmpty && !hasValue(eiendomList) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const eiendomTableElement = renderEiendomTable(eiendomList, textResources, textResourceBindings);
                this.appendChild(eiendomTableElement);
                this.appendChild(renderFeedbackListElement(validationMessages));
            }
        }
    }
);
