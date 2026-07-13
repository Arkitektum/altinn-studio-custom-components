// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

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
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                            host.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
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
                        host.appendChild(sjekklistekravListElement);

                        // Remove the last divider
                        if (sjekklistekravListElement.lastChild) {
                            sjekklistekravListElement.removeChild(sjekklistekravListElement.lastChild);
                        }

                        if (hasValue(component?.resourceValues?.description)) {
                            const descriptionElement = renderDescription(component);
                            host.appendChild(descriptionElement);
                        }
                    }
                }
            });
        }
    }
);
