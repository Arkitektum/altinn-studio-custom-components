export default {
    language: "nb",
    resources: [
        {
            id: "signing.summary.title.override",
            value: "Denne har signert på vegne av {0}",
            variables: [
                {
                    key: "instanceOwnerName",
                    dataSource: "instanceContext"
                }
            ]
        },
        {
            id: "signing.summary.title",
            value: "Søknaden er signert av"
        },
        {
            id: "pdfPreviewText",
            value: "Dokumentet er en forhåndsvisning"
        },
        {
            id: "appOwner",
            value: ""
        },
        {
            id: "resource.innledning",
            value: "Innledningstekst"
        },
        {
            id: "resource.emptyFieldText.default",
            value: "-"
        },
        {
            id: "resource.rowNumberTitle.default",
            value: "Nr."
        },
        {
            id: "resource.trueText.default",
            value: "Ja"
        },
        {
            id: "resource.falseText.default",
            value: "Nei"
        },
        {
            id: "resource.operator.minus",
            value: "-"
        },
        {
            id: "resource.operator.plus",
            value: "+"
        },
        {
            id: "resource.operator.equals",
            value: "="
        },
        {
            id: "resource.unit.meterSquared",
            value: "m²"
        },
        {
            id: "resource.customField.data.title",
            value: "Label for datafelt"
        },
        {
            id: "resource.adresse.title",
            value: "Adresse"
        },
        {
            id: "resource.customField.booleanData.title",
            value: "Label for boolean-data felt"
        },
        {
            id: "resource.customField.booleanText.title",
            value: "Label for boolean-text felt"
        },
        {
            id: "resource.customField.booleanText.true.title",
            value: "Ja"
        },
        {
            id: "resource.customField.booleanText.false.title",
            value: "Nei"
        },
        {
            id: "resource.customField.booleanText.default.title",
            value: "-"
        },
        {
            id: "resource.customField.countData.title",
            value: "Label for count-data felt"
        },
        {
            id: "resource.customField.kode.title",
            value: "Label for kodefelt"
        },
        {
            id: "resource.customField.kommunensSaksnummer.title",
            value: "Kommunens saksnummer"
        },
        {
            id: "resource.customField.part.navn.title",
            value: "Organisasjon"
        },
        {
            id: "resource.customField.prosjekt.title",
            value: "Prosjekt"
        },
        {
            id: "resource.customField.telefonnummer.title",
            value: "Telefonnummer"
        },
        {
            id: "resource.customField.utfallSvar.status.title",
            value: "Status"
        },
        {
            id: "resource.utfallBesvarelse.utfallSvar.erUtfallBesvaresSenere",
            value: "Besvares senere"
        },
        {
            id: "resource.utfallBesvarelse.utfallSvar.erUtfallBesvart",
            value: "Svar innsendt tidligere"
        },
        {
            id: "resource.utfallBesvarelse.utfallSvar.status",
            value: "Besvares nå"
        },
        {
            id: "resource.customHeader.text.title",
            value: "Custom header text"
        },
        {
            id: "resource.customParagraph.text.title",
            value: "Custom paragraph text"
        },
        {
            id: "resource.customSubheader.text.title",
            value: "Custom subheader text"
        },
        {
            id: "resource.customList.data.title",
            value: "Elementer"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.title",
            value: "Løfteinnretninger"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.erLoefteinnretningIBygning.title",
            value: "Er det løfteinnretninger som omfattes av TEK i bygningen?"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.planleggesLoefteinnretningIBygning.title",
            value: "Planlegges løfteinnretninger som omfattes av TEK i bygningen?"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.planlagteLoefteinnretninger.title",
            value: "Planlagte løfteinnretninger"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.planleggesHeis.title",
            value: "Det planlegges heis"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.planleggesLoefteplattform.title",
            value: "Det planlegges løfteplattform"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.planleggesRulletrapp.title",
            value: "Det planlegges rulletrapp"
        },
        {
            id: "resource.rammebetingelser.loefteinnretninger.planleggesTrappeheis.title",
            value: "Det planlegges trappeheis"
        },
        {
            id: "resource.customList.vedlegg.title",
            value: "Vedlegg"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.title",
            value: "Planer"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.emptyFieldText",
            value: "Ingen planer registrert"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.bebyggelsen.title",
            value: "Bebyggelsen"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.tomtearealet.title",
            value: "Tomtearealet"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.arealBebyggelseEksisterende.title",
            value: "Areal eksisterende bebyggelse"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.arealBebyggelseNytt.title",
            value: "Areal ny bebyggelse"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.arealBebyggelseSomSkalRives.title",
            value: "Areal som skal rives"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.arealSumByggesak.title",
            value: "Sum areal"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.beregnetMaksByggeareal.title",
            value: "Beregnet maksimalt byggeareal iht. plan"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.parkeringsarealTerreng.title",
            value: "Parkeringsareal"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.tomtearealBeregnet.title",
            value: "Beregnet tomteareal"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.tomtearealByggeomraade.title",
            value: "Byggeområde/grunneiendom"
        },
        {
            id: "resource.customSummation.data.title",
            value: "Oppsummering av arealdata"
        },
        {
            id: "resource.customSummation.areaBasis.title",
            value: "Beregningsgrunnlag"
        },
        {
            id: "resource.customSummation.areaMinus.title",
            value: "Ev. areal som trekkes fra iht. beregningsregler"
        },
        {
            id: "resource.customSummation.areaEquals.title",
            value: "Areal som skal byggesesakbehandles"
        },
        {
            id: "resource.rammebetingelser.arealdisponering.tomtearealSomTrekkesFra.title",
            value: "Ev. areal som trekkes fra iht. beregningsregler"
        },
        {
            id: "resource.arbeidsplasser.title",
            value: "Hvilke arbeidsplasser er berørt av tiltaket"
        },
        {
            id: "resource.arbeidsplasser.emptyFieldText",
            value: "Ingen arbeidsplasser registrert"
        },
        {
            id: "resource.arbeidsplasser.arbeidsplasserKey.title",
            value: "Arbeidsplasser"
        },
        {
            id: "resource.arbeidsplasser.beroertAvTiltaket.title",
            value: "Berørt av tiltaket"
        },
        {
            id: "resource.arbeidsplasser.eksisterende.title",
            value: "Eksisterende arbeidsplasser"
        },
        {
            id: "resource.arbeidsplasser.faste.title",
            value: "Faste arbeidsplasser"
        },
        {
            id: "resource.arbeidsplasser.framtidige.title",
            value: "Framtidige arbeidsplasser"
        },
        {
            id: "resource.arbeidsplasser.midlertidige.title",
            value: "Midlertidige arbeidsplasser"
        },
        {
            id: "resource.arbeidsplasser.utleieBygg.title",
            value: "Utleiebygg"
        },
        {
            id: "resource.customTable.data.title",
            value: "Data"
        },
        {
            id: "resource.customTable.data.emptyFieldText",
            value: "Ingen data registrert"
        },
        {
            id: "resource.customTable.data.navn.title",
            value: "Navn"
        },
        {
            id: "resource.customTable.data.dato.title",
            value: "Dato"
        },
        {
            id: "resource.customTable.data.kommentar.title",
            value: "Kommentar"
        },
        {
            id: "resource.customTable.eiendom.title",
            value: "Eiendom/byggested"
        },
        {
            id: "resource.eiendomByggested.eiendom.adresse.title",
            value: "Adresse"
        },
        {
            id: "resource.eiendomByggested.eiendom.adresse.emptyFieldText",
            value: "(Adresse mangler)"
        },
        {
            id: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.gaardsnummer.title",
            value: "Gårds-nummer"
        },
        {
            id: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.bruksnummer.title",
            value: "Bruks-nummer"
        },
        {
            id: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.seksjonsnummer.title",
            value: "Seksjons-nummer"
        },
        {
            id: "resource.eiendomByggested.eiendom.eiendomsidentifikasjon.festenummer.title",
            value: "Feste-nummer"
        },
        {
            id: "resource.eiendomByggested.eiendom.bolignummer.title",
            value: "Bruksenhets-nummer"
        },
        {
            id: "resource.eiendomByggested.eiendom.bygningsnummer.title",
            value: "Bygnings-nummer"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title",
            value: "Matrikkelinformasjon"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.emptyFieldText",
            value: "Ingen eiendommer registrert"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.adresse.title",
            value: "Adresse"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.gaardsnummer.title",
            value: "Gårds-nummer"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.bruksnummer.title",
            value: "Bruks-nummer"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.seksjonsnummer.title",
            value: "Seksjons-nummer"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.eiendomsidentifikasjon.festenummer.title",
            value: "Feste-nummer"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bolignummer.title",
            value: "Bruksenhets-nummer"
        },
        {
            id: "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.bygningsnummer.title",
            value: "Bygnings-nummer"
        },
        {
            id: "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.title",
            value: "Oversikt over områderisikoer der byggverket skal plasseres"
        },
        {
            id: "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.risikotype.title",
            value: "Naturpåkjenning"
        },
        {
            id: "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.sikkerhetsklasse.title",
            value: "Sikkerhetsklasse/tiltakskategori"
        },
        {
            id: "resource.planer.andrePlaner.title",
            value: "Andre planer"
        },
        {
            id: "resource.planer.andrePlaner.plan.navn.title",
            value: "Navn på plan"
        },
        {
            id: "resource.planer.andrePlaner.plan.plantype.title",
            value: "Type plan"
        },
        {
            id: "resource.tiltakshaver.kontaktperson.header",
            value: "Kontaktperson for tiltakshaver"
        },
        {
            id: "resource.tiltakshaver.kontaktperson.navn.title",
            value: "Kontaktperson"
        },
        {
            id: "resource.tiltakshaver.kontaktperson.telefonnummer.title",
            value: "Telefonnummer"
        },
        {
            id: "resource.tiltakshaver.kontaktperson.epost.title",
            value: "E-postadresse"
        }
    ]
};
