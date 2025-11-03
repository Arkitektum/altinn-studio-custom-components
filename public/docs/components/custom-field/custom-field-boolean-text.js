export default {
    id: "customField-boolean-text",
    type: "Custom",
    tagName: "custom-field-boolean-text",
    hideTitle: true,
    hideIfEmpty: false,
    inline: false,
    dataModelBindings: {
        simpleBinding: "customField.booleanText.condition"
    },
    resourceBindings: {
        title: "resource.customField.booleanText.title",
        trueText: "resource.customField.booleanText.true.title",
        falseText: "resource.customField.booleanText.false.title",
        defaultText: "resource.customField.booleanText.default.title",
        emptyFieldText: "resource.emptyFieldText.default"
    }
};
