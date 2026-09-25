import type NaboGjenboerEiendom from "../../../classes/data-classes/NaboGjenboerEiendom.ts";
// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderDivider, renderEmptyFieldText, renderHeaderElement, renderNaboGjenboerEiendomGroup } from "./renderers.ts";

export default customElements.define(
    "custom-grouplist-nabo-gjenboer-eiendom",
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
                    // Past the isEmpty branch above, so this is the list rather than the empty-field text.
                    for (const naboGjenboerEiendom of (component?.resourceValues?.data as NaboGjenboerEiendom[] | undefined) ?? []) {
                        host.appendChild(renderNaboGjenboerEiendomGroup(naboGjenboerEiendom, component));
                        host.appendChild(renderDivider());
                    }
                }
            });
        }
    }
);
