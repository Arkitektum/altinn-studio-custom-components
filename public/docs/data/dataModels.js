export default [
    {
        data: {
            customField: {
                adresse: {
                    adresselinje1: "Adressevegen 16",
                    adresselinje2: null,
                    adresselinje3: null,
                    postnr: "1234",
                    poststed: "Poststed",
                    landkode: "NO"
                },
                data: "Verdi for datafelt",
                booleanData: {
                    condition: true,
                    trueData: "Verdi hvis sann",
                    falseData: "Verdi hvis usann",
                    defaultData: "Standard verdi"
                },
                booleanText: {
                    condition: false
                },
                countData: ["Element 1", "Element 2", "Element 3"],
                kode: {
                    kodeverdi: "kode123",
                    kodebeskrivelse: "Beskrivelse av kode123"
                },
                kommunensSaksnummer: {
                    saksaar: 2024,
                    sakssekvensnummer: 12345
                },
                part: {
                    partstype: {
                        kodeverdi: "Foretak",
                        kodebeskrivelse: "Foretak"
                    },
                    foedselsnummer: null,
                    organisasjonsnummer: "910748548",
                    navn: "Selskap AS",
                    adresse: {
                        adresselinje1: "Adressevegen 21",
                        adresselinje2: null,
                        adresselinje3: null,
                        postnr: "3802",
                        poststed: "Bø i Telemark",
                        landkode: "NO"
                    },
                    telefonnummer: "111223344",
                    mobilnummer: "12034043",
                    epost: "test2@arkitektum.no"
                },
                prosjekt: {
                    prosjektnavn: "Prosjektnavn Eksempel",
                    prosjektnr: "PNR-2025"
                },
                utfallSvarStatus: {
                    erUtfallBesvaresSenere: false,
                    erUtfallBesvart: false
                }
            },
            customList: {
                data: [
                    {
                        kodeverdi: "element1",
                        kodebeskrivelse: "Beskrivelse av element 1"
                    },
                    {
                        kodeverdi: "element2",
                        kodebeskrivelse: "Beskrivelse av element 2"
                    },
                    {
                        kodeverdi: "element3",
                        kodebeskrivelse: "Beskrivelse av element 3"
                    }
                ],
                loefteinnretninger: {
                    erLoefteinnretningIBygning: false,
                    planleggesLoefteinnretningIBygning: true,
                    planleggesHeis: false,
                    planleggesTrappeheis: true,
                    planleggesRulletrapp: true,
                    planleggesLoefteplattform: false
                },
                vedlegg: [
                    {
                        vedleggstype: {
                            kodeverdi: "attachment1",
                            kodebeskrivelse: "Vedlegg 1"
                        },
                        filnavn: "File1.pdf"
                    },
                    {
                        vedleggstype: {
                            kodeverdi: "attachment2",
                            kodebeskrivelse: "Vedlegg 2"
                        },
                        filnavn: "File2.pdf"
                    }
                ]
            },
            customTable: {
                eiendom: [
                    {
                        eiendomsidentifikasjon: {
                            kommunenummer: "1234",
                            gaardsnummer: 33,
                            bruksnummer: 16,
                            festenummer: 0,
                            seksjonsnummer: 0
                        },
                        adresse: {
                            adresselinje1: "Adressevegen 1",
                            adresselinje2: "",
                            adresselinje3: "",
                            postnr: "1234",
                            poststed: "Bø",
                            landkode: "NO",
                            gatenavn: "Adressevegen",
                            husnr: "1",
                            bokstav: ""
                        },
                        bygningsnummer: "1234567",
                        bolignummer: "H0101",
                        kommunenavn: "Oslo"
                    },
                    {
                        eiendomsidentifikasjon: {
                            kommunenummer: "0301",
                            gaardsnummer: 208,
                            bruksnummer: 391,
                            festenummer: 0,
                            seksjonsnummer: 0
                        },
                        adresse: {
                            adresselinje1: "",
                            adresselinje2: "",
                            adresselinje3: "",
                            postnr: "",
                            poststed: "",
                            landkode: "NO",
                            gatenavn: "",
                            husnr: "",
                            bokstav: ""
                        },
                        bygningsnummer: "81099618",
                        bolignummer: "H0101",
                        kommunenavn: "Oslo"
                    }
                ]
            },
            dispensasjonOversikt: {
                dispensasjon: [
                    {
                        dispensasjonReferanse: "89fa33df-079a-407c-8371-4e85df5cf418",
                        dispensasjonKategori: {
                            kodeverdi: "plassering",
                            kodebeskrivelse: "Plassering"
                        },
                        dispensasjonTittel: {
                            kodeverdi: "byggegrenser",
                            kodebeskrivelse: "Byggegrenser"
                        },
                        bestemmelserType: {
                            kodeverdi: "RP",
                            kodebeskrivelse: "Reguleringsplan"
                        }
                    }
                ]
            },
            tiltakshaver: {
                partstype: {
                    kodeverdi: "Foretak",
                    kodebeskrivelse: "Foretak"
                },
                foedselsnummer: null,
                organisasjonsnummer: "910748548",
                navn: "BLOMSTERDALEN OG ØVRE SNERTINGDAL",
                adresse: {
                    adresselinje1: "Bøgata 16",
                    adresselinje2: null,
                    adresselinje3: null,
                    postnr: "3802",
                    poststed: "Bø i Telemark",
                    landkode: "NO"
                },
                telefonnummer: "111223344",
                mobilnummer: "12034043",
                epost: "test2@arkitektum.no",
                kontaktperson: {
                    navn: "Test Person",
                    telefonnummer: "111223344",
                    mobilnummer: "12034043",
                    epost: "test2@arkitektum.no"
                }
            }
        }
    }
];
