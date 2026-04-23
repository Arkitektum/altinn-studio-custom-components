// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { addDevToolsOverlay, isDevMode, renderHiddenDevToolsElement } from "../../../functions/devToolsHelpers.js";
import { getComponentContainerElement } from "../../../functions/helpers.js";
import { instantiateComponent } from "../../../functions/componentHelpers.js";
import { renderFeedbackListElement } from "../../../functions/feedbackHelpers.js";

// Local functions
import {
    renderDescription,
    renderDivider,
    renderEmptyFieldText,
    renderHeaderElement,
    renderSjekklistekravGroup,
    renderSjekklistekravGroupListHeader
} from "./renderers.js";

// Stylesheet
import "./styles.css" with { type: "css" };

export default customElements.define(
    "custom-grouplist-sjekklistekrav",
    class extends HTMLElement {
        connectedCallback() {
            const component = instantiateComponent(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (component?.hideIfEmpty && component.isEmpty && !!componentContainerElement) {
                if (isDevMode()) {
                    const hiddenEl = renderHiddenDevToolsElement(this, component, "data");
                    if (hiddenEl) this.appendChild(hiddenEl);
                } else {
                    componentContainerElement.style.display = "none";
                }
            } else if (component?.isEmpty) {
                const emptyFieldTextElement = renderEmptyFieldText(component);
                this.appendChild(emptyFieldTextElement);
                addDevToolsOverlay(this, component, "data");
            } else {
                if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                    this.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                }
                const sjekklistekravListElement = document.createElement("div");
                sjekklistekravListElement.className = "sjekklistekrav-list";

                const sjekklistekravGroupListHeaderElement = renderSjekklistekravGroupListHeader(component);
                if (sjekklistekravGroupListHeaderElement) {
                    sjekklistekravListElement.appendChild(sjekklistekravGroupListHeaderElement);
                }
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

                if (hasValue(component?.resourceValues?.description)) {
                    const descriptionElement = renderDescription(component);
                    this.appendChild(descriptionElement);
                }
                addDevToolsOverlay(this, component, "data");
            }
            const feedbackListElement = component?.hasValidationMessages && renderFeedbackListElement(component?.validationMessages);
            if (feedbackListElement) {
                this.appendChild(feedbackListElement);
            }
        }
    }
);
