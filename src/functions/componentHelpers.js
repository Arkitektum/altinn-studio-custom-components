// Classes
import CustomFieldAdresse from "../classes/system-classes/component-classes/CustomFieldAdresse.js";
import CustomFieldData from "../classes/system-classes/component-classes/CustomFieldData.js";
import CustomFieldPartNavn from "../classes/system-classes/component-classes/CustomFieldPartNavn.js";
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
        default:
            return new CustomComponent(component);

            console.warn(`Unknown component type: ${tagName}`);
            return null;
    }
}
