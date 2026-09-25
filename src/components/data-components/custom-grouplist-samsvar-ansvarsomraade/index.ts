// Dependencies
import { createCustomElement } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import { renderEmptyFieldText, renderSamsvarAnsvarsomraadeGroup } from "./renderers.ts";

/** One row of the list, of which the sort reads only the function code it is ordered by. */
interface SamsvarRow {
    funksjon?: { kodeverdi?: string };
}

export default customElements.define(
    "custom-grouplist-samsvar-ansvarsomraade",
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
                        const data = component?.resourceValues?.data ?? [];

                        data.sort((a: SamsvarRow, b: SamsvarRow) => {
                            const aCode = a?.funksjon?.kodeverdi?.toUpperCase();
                            const bCode = b?.funksjon?.kodeverdi?.toUpperCase();

                            if (aCode === "PRO" && bCode !== "PRO") return -1;
                            if (aCode !== "PRO" && bCode === "PRO") return 1;
                            return 0;
                        });
                        for (const samsvarAnsvarsomraade of data) {
                            const samsvarAnsvarsomraadeElement = renderSamsvarAnsvarsomraadeGroup(samsvarAnsvarsomraade, component);
                            host.appendChild(samsvarAnsvarsomraadeElement);
                            const dividerElement = createCustomElement("custom-divider");
                            host.appendChild(dividerElement);
                        }
                    }
                }
            });
        }
    }
);
