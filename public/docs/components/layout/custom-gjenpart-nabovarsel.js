const markup = {
    id: "custom-gjenpart-nabovarsel",
    type: "Custom",
    tagName: "custom-gjenpart-nabovarsel",
    dataModelBindings: {
        ansvarligSoeker: "customLayout.gjenpartNabovarsel.ansvarligSoeker",
        eiendomByggested: "customLayout.gjenpartNabovarsel.eiendomByggested",
        kontaktpersonForNabovarselet: "customLayout.gjenpartNabovarsel.kontaktpersonForNabovarselet",
        naboGjenboerEiendommer: "customLayout.gjenpartNabovarsel.naboGjenboerEiendommer",
        planer: "customLayout.gjenpartNabovarsel.planer",
        soeknadGjelder: "customLayout.gjenpartNabovarsel.soeknadGjelder",
        tiltakshaver: "customLayout.gjenpartNabovarsel.tiltakshaver"
    }
};

const defaultResourceBindings = {
    gjenpartNabovarsel: {
        title: "resource.gjenpartNabovarsel.title",
        description: "resource.gjenpartNabovarsel.description"
    },
    naboGjenboerEiendom: {
        title: "resource.naboGjenboer.title"
    },
    soeknadGjelderHeader: {
        title: "resource.soeknadGjelder.title"
    },
    eiendomByggested: {
        title: "resource.eiendomByggested.eiendom.title"
    },
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
    eiendomMatrikkelinformasjon: {
        title: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title"
    },
    detVarslesHervedOmHeader: {
        title: "resource.detVarslesHervedOm.title"
    },
    soeknadGjelderType: {
        title: "resource.soeknadGjelder.type.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    soeknadGjelderBrukTiltaksformaal: {
        title: "resource.soeknadGjelder.bruk.tiltaksformaal.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    soeknadGjelderBrukBeskrivPlanlagtFormaal: {
        title: "resource.soeknadGjelder.bruk.beskrivPlanlagtFormaal.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    planerGjeldendePlan: {
        title: "resource.planer.gjeldendePlan.title"
    },
    planerGjeldendePlanNavn: {
        title: "resource.planer.gjeldendePlan.navn.title"
    },
    planerGjeldendePlanPlantype: {
        title: "resource.planer.gjeldendePlan.plantype.title"
    },
    spoersmaalRettesTil: {
        title: "resource.spoersmaalRettesTil.title"
    },
    kontaktpersonForNabovarselet: {
        title: "resource.kontaktpersonForNabovarselet.title",
        emptyFieldText: "resource.emptyFieldText.default"
    },
    merknaderSendesTil: {
        title: "resource.merknaderSendesTil.title"
    },
    ansvarligSoeker: {
        title: "resource.ansvarligSoeker.title"
    },
    tiltakshaver: {
        title: "resource.tiltakshaver.title"
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
    },
    responsMerknadMottattDato: {
        title: "resource.respons.merknadMottattDato.title"
    },
    responsSamtykkeMottattDato: {
        title: "resource.respons.samtykkeMottattDato.title"
    }
};

export default { markup, defaultResourceBindings };
