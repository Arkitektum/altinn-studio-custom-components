const markup = {
    id: "custom-field-prosjekt",
    type: "Custom",
    tagName: "custom-field-prosjekt",
    hideTitle: false,
    hideIfEmpty: false,
    dataModelBindings: {
        data: "customField.prosjekt"
    },
    resourceBindings: {
        title: "resource.customField.prosjekt.title",
        emptyFieldText: "resource.emptyFieldText.default"
    }
};

export default { markup };
