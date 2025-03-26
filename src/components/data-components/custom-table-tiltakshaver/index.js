import CustomComponent from "../../../classes/system-classes/CustomComponent.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";
import { getPart, renderTiltakshaverTable } from "./functions.js";
import textResourceBindings from "./textResourceBindings.js";

export default customElements.define(
    "custom-table-tiltakshaver",
    class extends HTMLElement {
        async connectedCallback() {
            const component = new CustomComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            const part = getPart(component);
            const textResources = window.textResources;
            const validationMessages = hasMissingTextResources(textResources, textResourceBindings);
            if (component?.hideIfEmpty && !hasValue(part) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const eiendomTableElement = renderTiltakshaverTable(part, textResources, textResourceBindings);
                this.appendChild(eiendomTableElement);
                this.appendChild(renderFeedbackListElement(validationMessages));
            }
        }
    }
);
