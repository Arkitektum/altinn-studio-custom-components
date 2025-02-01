import {
    createCustomElement,
    getComponentContainerElement,
    getComponentTexts,
    getCustomComponentProps,
    hasValue
} from "../../../functions/helpers.js";
import { groupArrayItemsByUtfallType } from "./functions.js";

export default customElements.define(
    "custom-grouplist-utfall-svar-type",
    class extends HTMLElement {
        async connectedCallback() {
            const { data } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            const texts = await getComponentTexts(this);
            const dataGroupedByUtfallType = groupArrayItemsByUtfallType(data);
            if (!hasValue(data) && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                for (const utfallType of Object.keys(dataGroupedByUtfallType)) {
                    const utfallTypeElement = await createCustomElement("custom-group-utfall-svar-type", {
                        data: dataGroupedByUtfallType[utfallType],
                        text: texts[`${utfallType?.toLowerCase()}.header`],
                        texts
                    });
                    this.appendChild(utfallTypeElement);
                }
            }
        }
    }
);
