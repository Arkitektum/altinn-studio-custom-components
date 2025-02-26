import UtfallSvarStatus from "../../../classes/UtfallSvarStatus.js";
import {
    createCustomElement,
    getComponentContainerElement,
    getCustomComponentProps
} from "../../../functions/helpers.js";
import { getStatusText } from "./functions.js";

export default customElements.define(
    "custom-field-utfall-svar-status",
    class extends HTMLElement {
        async connectedCallback() {
            const { formData, text, hideTitle, hideIfEmpty, inline, styleOverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const utfallSvarStatus = new UtfallSvarStatus(formData?.data);
            const statusText = await getStatusText(utfallSvarStatus, this);
            if (hideIfEmpty && !statusText?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                this.innerHTML = createCustomElement("custom-field", {
                    formData: { simpleBinding: statusText },
                    text: title,
                    inline,
                    styleOverride
                }).outerHTML;
            }
        }
    }
);
