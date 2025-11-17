const markup = {
    id: "custom-table-nabo-gjenboer-eiendom",
    type: "Custom",
    tagName: "custom-table-nabo-gjenboer-eiendom",
    dataModelBindings: {
        data: "customTable.naboGjenboerEiendom"
    },
    resourceBindings: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title",
        emptyFieldText: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.emptyFieldText"
    }
};

const defaultResourceBindings = {
    adresse: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.title",
        emptyFieldText: "resource.eiendomByggested.eiendom.adresse.emptyFieldText"
    },
    eiendomsidentifikasjonGaardsnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.gaardsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomsidentifikasjonBruksnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.bruksnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomsidentifikasjonSeksjonsnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.seksjonsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomsidentifikasjonFestenummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.festenummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    bolignummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bolignummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    bygningsnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bygningsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title",
    emptyFieldText: "resource.emptyFieldText.default"
};

export default { markup, defaultResourceBindings };
