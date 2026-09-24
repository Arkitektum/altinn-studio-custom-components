// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderUtfallSvarType } from "./renderers.ts";

export default customElements.define(
    "custom-grouplist-utfall-svar-type",
    class extends HTMLElement {
        connectedCallback() {
            renderCustomComponent(this, {
                type: "data",
                render: (host, component) => {
                    const utfallSvarTypeData = component?.resourceValues?.data;
                    if (!utfallSvarTypeData) {
                        return;
                    }
                    for (const utfallTypeKey of Object.keys(utfallSvarTypeData)) {
                        host.appendChild(renderUtfallSvarType(component, utfallTypeKey));
                    }
                }
            });
        }
    }
);
