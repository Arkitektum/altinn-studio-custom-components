export default {
    dispensasjonBeskrivelse: {
        dispensasjonTittel: {
            kodeverdi: "byggeGrense",
            kodebeskrivelse: "Byggegrenser"
        },
        inngangsbeskrivelse: {
            kodeverdi: "byggeLinje",
            kodebeskrivelse: "Vi vil plassere tiltaket utenfor regulert byggelinje"
        },
        annenInngangsbeskrivelse: "Vi ønsker dispensasjon fra byggegrense for å kunne bygge nærmere veien.",
        beskrivelse: "Vi søker om dispensasjon fra byggegrenser for å kunne maksimere utnyttelsen av tomten vår."
    },
    dispensasjonreferanse: "123e4567-e89b-12d3-a456-426614174000",
    soeknadstype: {
        kodeverdi: "NV",
        kodebeskrivelse: "Nabovarsel"
    },
    tiltakstyper: {
        type: {
            kode: [
                {
                    kodeverdi: "BYGGING",
                    kodebeskrivelse: "Bygging"
                },
                {
                    kodeverdi: "FRADELING",
                    kodebeskrivelse: "Fradeling"
                }
            ]
        }
    },
    dispensasjonFra: {
        bestemmelserType: {
            kodeverdi: "reguleringsPlan",
            kodebeskrivelse: "Reguleringsplan"
        },
        dispensasjonPlanBestemmelse: {
            navn: "Byggegrense §5.2",
            nasjonalArealplanId: {
                administrativEnhet: "0301",
                planidentifikasjon: "123456789"
            },
            planbestemmelse: {
                nummerering: "3.10",
                overskrift: "Byggegrenser",
                bestemmelsestekst: "Byggegrenser skal være i henhold til reguleringsplanens bestemmelser."
            },
            gradAvUtnytting: "40",
            beregningsregelGradAvUtnytting: {
                kodeverdi: "annet",
                kodebeskrivelse: "Annet i m2"
            },
            lovbestemmelse: "§ 8-9 (2) Trapp i uteareal"
        }
    },
    stedfesting: {
        posisjon: {
            koordinatsystem: {
                kodeverdi: "EPSG:25835",
                kodebeskrivelse: "EUREF89 UTM sone 35"
            },
            koordinater: {
                koordinat: [59.9139, 10.7522]
            }
        },
        vertikalnivaa: {
            kodeverdi: "2",
            kodebeskrivelse: "På grunnen/vannoverflate"
        }
    },
    varighet: {
        oenskesVarigDispensasjon: true,
        oensketVarighetTil: "2025-12-31T00:00:00"
    },
    begrunnelse: {
        hensynBakBestemmelsen:
            "Regulert avstand til vei skal sikre fri sikt langs veien. Den skal også sikre at det er tilstrekkelig bredde til at veien kan utvides med for eksempel gang og sykkelvei.",
        vurderingHensynBakBestemmelsen: "Garasjen vil ikke påvirke fri sikt eller bredden på veien.",
        vurderingHensynOverordnet: "Nasjonale og regionale interesser blir ikke vesentlig tilsidesatt av av endringen.",
        fordeler: {
            effekt: ["Økt naturmangfold ved at garasjen kan plasseres i tilstrekkelig avstand fra eiketreet", "Fordel 2", "Fordel 3"]
        },
        ulemper: {
            effekt: ["Hvis jeg får dispensasjon, kan det føre til at også naboene ønsker å bygge nærme veien", "Ulempe 2", "Ulempe 3"]
        },
        samletBegrunnelse: "Fordelene er vesentlig større enn ulempene."
    }
};
