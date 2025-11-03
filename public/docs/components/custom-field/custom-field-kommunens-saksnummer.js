export default {
    id: "custom-field-kommunens-saksnummer",
    type: "Custom",
    tagName: "custom-field-kommunens-saksnummer",
    hideTitle: false,
    hideIfEmpty: false,
    inline: false,
    dataModelBindings: {
        data: "customField.kommunensSaksnummer"
    },
    resourceBindings: {
        title: "resource.customField.kommunensSaksnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    }
};
