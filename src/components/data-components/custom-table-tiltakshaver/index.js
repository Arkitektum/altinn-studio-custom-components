// Classes
import CustomComponent from "../../../classes/system-classes/CustomComponent.js";

// Global functions
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { hasMissingTextResources } from "../../../functions/validations.js";

// Local functions
import { getPart } from "./functions.js";
import textResourceBindings from "./textResourceBindings.js";
import { renderTiltakshaverTable } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

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
                const tiltakshaverTable = renderTiltakshaverTable(part, textResources, textResourceBindings, component?.size);
                this.appendChild(tiltakshaverTable);
                this.appendChild(renderFeedbackListElement(validationMessages));
            }
        }
    }
);
