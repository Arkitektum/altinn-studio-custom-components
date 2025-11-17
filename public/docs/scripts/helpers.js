// Constants
import componentNames from "../constants/componentNames";
import componentTypeNames from "../constants/componentTypeNames";

export function getComponentNameFromTagName(tagName) {
    const componentNameEntry = Object.entries(componentNames).find(([key, value]) => key === tagName);
    return componentNameEntry ? componentNameEntry[1] : tagName;
}

export function getComponentTypeNameFromKey(key) {
    const componentTypeNameEntry = Object.entries(componentTypeNames).find(([typeKey, typeName]) => typeKey === key);
    return componentTypeNameEntry ? componentTypeNameEntry[1] : key;
}
