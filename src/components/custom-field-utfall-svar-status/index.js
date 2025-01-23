import UtfallSvarStatus from "../../classes/UtfallSvarStatus.js";
import { getComponentContainerElement, getCustomComponentProps, renderFieldElement } from "../../functions/helpers.js";
import { getStatusText } from "./functions.js";

export default customElements.define(
    "custom-field-utfall-svar-status",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const utfallSvarStatus = new UtfallSvarStatus(data);
            const title = !hideTitle && text;
            const statusText = await getStatusText(utfallSvarStatus, this);
            if (hideIfEmpty && !statusText?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                this.innerHTML = renderFieldElement(title, statusText, true, styleoverride);
            }
        }
    }
);
