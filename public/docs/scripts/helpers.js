import componentNames from "../constants/componentNames";

export function getComponentNameFromTagName(tagName) {
    const componentNameEntry = Object.entries(componentNames).find(([key, value]) => key === tagName);
    return componentNameEntry ? componentNameEntry[1] : tagName;
}
