import UtfallSvarStatus from "../../classes/UtfallSvarStatus";
import { getComponentContainerElement, getCustomComponentProps, renderFieldElement } from "../../functions/helpers";
import { getStatusText } from "./functions";

export default customElements.define(
    "custom-field-utfall-svar-status",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, inline, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const utfallSvarStatus = new UtfallSvarStatus(data);
            const statusText = await getStatusText(utfallSvarStatus, this);
            if (hideIfEmpty && !statusText?.length && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const title = !hideTitle && text;
                const options = {
                    inline,
                    styleoverride
                };
                this.innerHTML = renderFieldElement(title, statusText, options);
            }
        }
    }
);
