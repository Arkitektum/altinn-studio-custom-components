import {
    createCustomElement,
    getComponentContainerElement,
    getComponentTexts,
    getCustomComponentProps
} from "../../../functions/helpers.js";

function getValueFromDataKey(data, dataKey) {
    if (!dataKey) {
        return;
    }
    const path = dataKey?.split(/\.|\[|\]/).filter(Boolean);
    for (let i = 0; i < path.length; i++) {
        data = data[path[i]];
    }
    return data;
}

function getTableHeaders(tableColumns, texts) {
    return tableColumns.map((column) => {
        return {
            text: texts[column.titleResourceKey],
            props: column.props
        };
    });
}

function getTableRows(tableColumns, data) {
    return data.map((row) => {
        const tr = [];
        tableColumns.forEach((column) => {
            const cellData = getValueFromDataKey(row, column.dataKey);
            tr.push({ ...column.props, data: cellData, hideTitle: true, tagName: column.tagName });
        });
        return tr;
    });
}

export default customElements.define(
    "custom-table-eiendom",
    class extends HTMLElement {
        async connectedCallback() {
            const { data, text, hideTitle, hideIfEmpty, emptyFieldText, styleoverride } = getCustomComponentProps(this);
            const componentContainerElement = getComponentContainerElement(this);
            if (hideIfEmpty && !data && !!componentContainerElement) {
                componentContainerElement.style.display = "none";
            } else {
                const texts = await getComponentTexts(this);
                const tableColumns = JSON.parse(this.getAttribute("tableColumns"));
                console.log({ tableColumns });
                const title = !hideTitle && text;
                this.innerHTML = createCustomElement("custom-table", {
                    data: {
                        tableHeaders: getTableHeaders(tableColumns, texts),
                        tableRows: getTableRows(tableColumns, data)
                    },
                    text: title,
                    emptyFieldText,
                    styleoverride
                }).outerHTML;
            }
        }
    }
);
