const markup = {
    id: "custom-group-adkomst",
    type: "Custom",
    tagName: "custom-group-adkomst",
    hideIfEmpty: false,
    hideTitle: false,
    dataModelBindings: {
        data: "customGroup.adkomst"
    }
};

const defaultResourceBindings = {
    title: "resource.rammebetingelser.adkomst.title",
    emptyFieldText: "resource.emptyFieldText.default",
    erNyEllerEndretAdkomst: {
        title: `resource.rammebetingelser.adkomst.erNyEllerEndretAdkomst.title`,
        trueText: `resource.trueText.default`,
        falseText: `resource.falseText.default`
    },
    vegtype: {
        title: `resource.rammebetingelser.adkomst.vegtype.title`
    }
};

export default { markup, defaultResourceBindings };
