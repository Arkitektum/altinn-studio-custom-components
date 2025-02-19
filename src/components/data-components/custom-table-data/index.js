import {
    createCustomElement,
    getComponentContainerElement,
    getComponentTexts,
    getCustomComponentProps
} from "../../../functions/helpers.js";
import { getTableHeaders, getTableRows } from "../../../functions/tableHelpers.js";

export default customElements.define(
    "custom-table-data",
    class extends HTMLElement {
        async connectedCallback() {
            const { formData, text, hideTitle, hideIfEmpty, emptyFieldText, size, styleoverride } =
                getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !formData?.data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const texts = await getComponentTexts(this);
                const tableColumns = JSON.parse(this.getAttribute("tableColumns"));
                const title = !hideTitle && text;
                this.innerHTML = createCustomElement("custom-table", {
                    formData: {
                        data: {
                            tableHeaders: getTableHeaders(tableColumns, texts),
                            tableRows: getTableRows(tableColumns, formData?.data)
                        }
                    },
                    text: title,
                    size,
                    emptyFieldText,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
