// Classes
import CustomFieldAdresse from "../classes/system-classes/component-classes/CustomFieldAdresse.js";
import CustomFieldData from "../classes/system-classes/component-classes/CustomFieldData.js";
import CustomFieldPartNavn from "../classes/system-classes/component-classes/CustomFieldPartNavn.js";
import CustomFieldTelefonnummer from "../classes/system-classes/component-classes/CustomFieldTelefonnummer.js";
import CustomTableData from "../classes/system-classes/component-classes/CustomTableData.js";
import CustomTableEiendom from "../classes/system-classes/component-classes/CustomTableEiendom.js";
import CustomTablePart from "../classes/system-classes/component-classes/CustomTablePart.js";
import CustomComponent from "../classes/system-classes/CustomComponent.js";

export function instantiateComponent(component) {
    const tagName = component?.tagName || component?.getAttribute("tagname") || "custom-component";
    switch (tagName?.toLowerCase()) {
        case "custom-component":
            return new CustomComponent(component);
        case "custom-field-adresse":
            return new CustomFieldAdresse(component);
        case "custom-field-data":
            return new CustomFieldData(component);
        case "custom-field-part-navn":
            return new CustomFieldPartNavn(component);
        case "custom-field-telefonnummer":
            return new CustomFieldTelefonnummer(component);
        case "custom-table-data":
            return new CustomTableData(component);
        case "custom-table-eiendom":
            return new CustomTableEiendom(component);
        case "custom-table-part":
            return new CustomTablePart(component);
        default:
            console.warn(`Unknown component type: ${tagName}`);
            return null;
    }
}
