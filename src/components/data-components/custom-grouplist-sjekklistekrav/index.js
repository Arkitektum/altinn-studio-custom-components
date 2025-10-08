// Global functions
import { getComponentContainerElement, hasValue } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import { renderDivider, renderEmptyFieldText, renderHeaderElement, renderSjekklistekravGroup } from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-grouplist-sjekklistekrav",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
            } else {
                if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                const sjekklistekravListElement = document.createElement("div");
                sjekklistekravListElement.className = "sjekklistekrav-list";
                for (const sjekklistekrav of component?.resourceValues?.data ?? []) {
                    const sjekklistekravElement = renderSjekklistekravGroup(sjekklistekrav, component);
                    sjekklistekravListElement.appendChild(sjekklistekravElement);
                    const dividerElement = renderDivider();
                    sjekklistekravListElement.appendChild(dividerElement);
                }
                this.appendChild(sjekklistekravListElement);

                // Remove the last divider
                if (sjekklistekravListElement.lastChild) {
                    sjekklistekravListElement.removeChild(sjekklistekravListElement.lastChild);
                }
                const feedbackListElement = component.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
                if (feedbackListElement) {
                    this.appendChild(feedbackListElement);
                }
            }
        }
    }
);
