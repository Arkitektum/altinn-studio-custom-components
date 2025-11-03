export default {
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
