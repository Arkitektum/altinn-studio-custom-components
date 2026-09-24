// Dependencies
import { CustomElementHtmlAttributes, createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";
import type { CustomElementProps } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderPlanlagteLoefteinnretningerList } from "./renderers.ts";

export default customElements.define(
    "custom-list-planlagte-loefteinnretninger",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    if (component?.isEmpty) {
                        const htmlAttributes = new CustomElementHtmlAttributes(component as CustomElementProps);
                        host.innerHTML = "";
                        host.appendChild(createCustomElement("custom-field", htmlAttributes));
                    } else {
                        const planlagteLoefteinnretningerListElement = renderPlanlagteLoefteinnretningerList(component);
                        host.appendChild(planlagteLoefteinnretningerListElement);
                    }
                }
            });
        }
    }
);
