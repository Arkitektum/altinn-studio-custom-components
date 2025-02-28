import ValidationMessages from "../classes/system-classes/ValidationMessages.js";

export function hasMissingTextResources(
    textResources,
    textResourceBindings,
    validationMessages = new ValidationMessages()
) {
    for (const componentName in textResourceBindings) {
        for (const textResourceKey in textResourceBindings[componentName]) {
            const key = textResourceBindings[componentName][textResourceKey];
            const textResource = textResources?.resources?.find((resource) => resource.id === key);
            if (!textResource) {
                validationMessages.error.push(`Missing text resource with id: "${key}"`);
            } else if (textResource.value === "") {
                validationMessages.info.push(`Empty text resource with id: "${key}"`);
            }
        }
    }
    return validationMessages;
}
