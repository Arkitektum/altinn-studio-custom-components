// Global functions
import { renderCustomComponent } from "../../../../functions/componentRenderHelpers.js";
import { renderEmptyFieldText } from "../../custom-grouplist-sjekklistekrav/custom-group-sjekklistekrav/renderers.js";

// Local functions
import { renderUtfallSvarGroupList } from "./renderers.js";

export default customElements.define(
    "custom-group-utfall-svar-type",
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
                        const utfallSvarGroupListElement = renderUtfallSvarGroupList(component);
                        host.appendChild(utfallSvarGroupListElement);
                    }
                }
            });
        }
    }
);
