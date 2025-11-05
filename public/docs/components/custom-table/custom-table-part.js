const markup = {
    id: "tiltakshaver.kontaktperson",
    type: "Custom",
    tagName: "custom-table-part",
    size: "h2",
    partType: "tiltakshaver.kontaktperson",
    hideIfEmpty: true,
    dataModelBindings: {
        data: "tiltakshaver.kontaktperson"
    }
};

const partType = "tiltakshaver.kontaktperson";

const defaultResourceBindings = {
    navn: {
        title: `resource.${partType}.navn.title`,
        emptyFieldText: "resource.emptyFieldText.default"
    },
    telefonnummer: {
        title: `resource.${partType}.telefonnummer.title`,
        emptyFieldText: "resource.emptyFieldText.default"
    },
    epost: {
        title: `resource.${partType}.epost.title`,
        emptyFieldText: "resource.emptyFieldText.default"
    },
    title: `resource.${partType}.header`,
    emptyFieldText: "resource.emptyFieldText.default"
};
export default { markup, defaultResourceBindings };
