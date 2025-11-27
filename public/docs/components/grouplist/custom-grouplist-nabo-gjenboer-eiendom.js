const markup = {
    id: "custom-grouplist-nabo-gjenboer-eiendom",
    type: "Custom",
    tagName: "custom-grouplist-nabo-gjenboer-eiendom",
    hideTitle: false,
    hideIfEmpty: false,
    size: "h2",
    dataModelBindings: {
        data: "customGrouplist.naboGjenboerEiendom"
    }
};

const defaultResourceBindings = {
    eiendomMatrikkelinformasjon: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title"
    },
    eiendomMatrikkelinformasjonAdresse: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.title",
        emptyFieldText: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.emptyFieldText"
    },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonGaardsnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.gaardsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonBruksnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.bruksnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonSeksjonsnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.seksjonsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomMatrikkelinformasjonEiendomsidentifikasjonFestenummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.festenummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomMatrikkelinformasjonBolignummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bolignummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eiendomMatrikkelinformasjonBygningsnummer: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bygningsnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eier: {
        title: "resource.eier.header"
    },
    eierNavn: {
        title: "resource.eier.navn.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eierTelefonnummer: {
        title: "resource.eier.telefonnummer.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eierEpost: {
        title: "resource.eier.epost.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    eierAdresse: {
        title: "resource.eier.adresse.title"
    },
    responsNabovarselSendtVia: {
        title: "resource.respons.nabovarselSendtVia.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    responsNabovarselSendt: {
        title: "resource.respons.nabovarselSendt.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    responsErMerknadEllerSamtykkeMottatt: {
        title: "resource.respons.erMerknadEllerSamtykkeMottatt.title",
        falseText: "resource.respons.erMerknadEllerSamtykkeMottatt.falseText"
    },
    responsErMerknadMottatt: {
        trueText: "resource.respons.erMerknadMottatt.trueText"
    },
    responsErSamtykkeMottatt: {
        trueText: "resource.respons.erSamtykkeMottatt.trueText"
    }
};

export default { markup, defaultResourceBindings };
