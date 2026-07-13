// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import {
    renderEmptyFieldText,
    renderErLoefteinnretningIBygningElement,
    renderHeaderElement,
    renderPlanlagteLoefteinnretningerElement,
    renderPlanleggesLoefteinnretningIBygningElement
} from "./renderers.js";

export default customElements.define(
    "custom-group-loefteinnretninger",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                        host.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                    }
                    if (component?.isEmpty) {
                        const emptyFieldTextElement = renderEmptyFieldText(component);
                        host.appendChild(emptyFieldTextElement);
                    } else {
                        host.appendChild(renderErLoefteinnretningIBygningElement(component));
                        host.appendChild(renderPlanleggesLoefteinnretningIBygningElement(component));
                        host.appendChild(renderPlanlagteLoefteinnretningerElement(component));
                    }
                }
            });
        }
    }
);
