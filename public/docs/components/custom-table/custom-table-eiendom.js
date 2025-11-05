const markup = {
    id: "customTable-eiendom",
    type: "Custom",
    tagName: "custom-table-eiendom",
    size: "h3",
    hideIfEmpty: true,
    dataModelBindings: {
        data: "customTable.eiendom"
    },
    resourceBindings: {
        title: "resource.customTable.eiendom.title"
    }
};

const defaultResourceBindings = {
    adresse: {
        title: "resource.eiendomByggested.eiendom.adresse.title",
        emptyFieldText: "resource.eiendomByggested.eiendom.adresse.emptyFieldText"
    },
    eiendomsidentifikasjonGaardsnummer: {
        title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.gaardsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomsidentifikasjonBruksnummer: {
        title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.bruksnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomsidentifikasjonSeksjonsnummer: {
        title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.seksjonsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomsidentifikasjonFestenummer: {
        title: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.festenummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    bolignummer: {
        title: "resource.eiendomByggested.eiendom.bolignummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    bygningsnummer: {
        title: "resource.eiendomByggested.eiendom.bygningsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    title: "resource.eiendomByggested.eiendom.title",
    emptyFieldText: "resource.emptyFieldText.default"
};

export default { markup, defaultResourceBindings };
