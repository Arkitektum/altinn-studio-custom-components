const markup = {
    id: "customField-adresse",
    type: "Custom",
    tagName: "custom-field-adresse",
    hideTitle: false,
    hideIfEmpty: false,
    dataModelBindings: {
        data: "customField.adresse"
    },
    resourceBindings: {
        title: "resource.adresse.title",
        emptyFieldText: "resource.emptyFieldText.default"
    }
};

const defaultResourceBindings = {
    title: "resource.adresse.title",
    emptyFieldText: "resource.adresse.emptyFieldText.default"
};

export default { markup, defaultResourceBindings };
