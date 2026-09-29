// Dependencies
import { hasValue } from "@arkitektum/altinn-studio-custom-components-utils";

// Global functions
import { renderCustomComponent } from "../../../functions/componentRenderHelpers.ts";

// Local functions
import {
    renderAdresseElement,
    renderBestillerreferanseElement,
    renderEmptyFieldText,
    renderEpostElement,
    renderFakturareferanseElement,
    renderHeaderElement,
    renderNavnElement,
    renderOrganisasjonsnummerElement,
    renderProsjektnummerElement
} from "./renderers.ts";

export default customElements.define(
    "custom-group-fakturamottaker",
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
                        host.appendChild(renderNavnElement(component));
                        host.appendChild(renderAdresseElement(component));
                        host.appendChild(renderOrganisasjonsnummerElement(component));
                        host.appendChild(renderBestillerreferanseElement(component));
                        host.appendChild(renderFakturareferanseElement(component));
                        host.appendChild(renderProsjektnummerElement(component));
                        host.appendChild(renderEpostElement(component));
                    }
                }
            });
        }
    }
);
