// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.js";

// Local functions
import { renderAnsvarsomraadeType, renderEmptyFieldText, renderHeaderElement } from "./renderers.js";

export default customElements.define(
    "custom-grouplist-ansvarsomraade-type",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                withFeedback: true,
                render: (host, component) => {
                    // Reached only when the component should not hide itself, so an empty one still explains itself.
                    if (component?.isEmpty) {
                        host.appendChild(renderEmptyFieldText(component));
                        return;
                    }
                    if (!component?.resourceValues?.data) {
                        return;
                    }
                    if (hasValue(component?.resourceValues?.title) && component?.hideTitle !== true) {
                        host.appendChild(renderHeaderElement(component?.resourceValues?.title, component?.size));
                    }
                    for (const ansvarsomraadeTypeKey of Object.keys(component?.resourceValues?.data)) {
                        host.appendChild(renderAnsvarsomraadeType(component, ansvarsomraadeTypeKey));
                    }
                }
            });
        }
    }
);
