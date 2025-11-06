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
                arbeidsplasser: {
                    framtidige: true,
                    faste: false,
                    midlertidige: true,
                    antallAnsatte: "31",
                    eksisterende: false,
                    utleieBygg: false,
                    antallVirksomheter: "1",
                    beskrivelse: "Beskrivelse av arbeidsplasser",
                    veiledning: false
                },
                data: [
                    {
                        navn: "Ola Nordmann",
                        dato: "2024-01-15",
                        kommentar: "Dette er en kommentar fra Ola."
                    },
                    {
                        navn: "Kari Nordmann",
                        dato: "2024-02-20",
                        kommentar: "Dette er en kommentar fra Kari."
                    }
                ],
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
                ],
                naboGjenboerEiendom: [
                    {
                        matrikkelinformasjon: {
                            eiendomsidentifikasjon: {
                                kommunenummer: "1234",
                                gaardsnummer: 33,
                                bruksnummer: 16,
                                festenummer: 0,
                                seksjonsnummer: 0
                            },
                            adresse: {
                                adresselinje1: "Naboens Adressevegen 2",
                                adresselinje2: "",
                                adresselinje3: "",
                                postnr: "1234",
                                poststed: "Bø",
                                landkode: "NO",
                                gatenavn: "Adressevegen",
                                husnr: "2",
                                bokstav: ""
                            },
                            bygningsnummer: "1234568",
                            bolignummer: "H0102",
                            kommunenavn: "Oslo"
                        }
                    },
                    {
                        matrikkelinformasjon: {
                            eiendomsidentifikasjon: {
                                kommunenummer: "0301",
                                gaardsnummer: 208,
                                bruksnummer: 391,
                                festenummer: 0,
                                seksjonsnummer: 0
                            },
                            address: {
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
                            bygningsnummer: "81099619",
                            bolignummer: "H0102",
                            kommunenavn: "Oslo"
                        }
                    }
                ],
                omraadeRisiko: [
                    {
                        risikotype: {
                            kodeverdi: "flom",
                            kodebeskrivelse: "Fare for flom"
                        },
                        sikkerhetsklasse: {
                            kodeverdi: "F1",
                            kodebeskrivelse: "Mindre fare for flom"
                        }
                    },
                    {
                        risikotype: {
                            kodeverdi: "skred",
                            kodebeskrivelse: "Fare for skred"
                        },
                        sikkerhetsklasse: {
                            kodeverdi: "S1",
                            kodebeskrivelse: "Mindre fare for skred"
                        }
                    },
                    {
                        risikotype: {
                            kodeverdi: "kvikkleire",
                            kodebeskrivelse: "Fare for kvikkleire"
                        },
                        sikkerhetsklasse: {
                            kodeverdi: "K1",
                            kodebeskrivelse: "Mindre fare for kvikkleire"
                        }
                    }
                ],
                plan: [
                    {
                        navn: "Kommuneplanens arealdel 2020-2030",
                        plantype: {
                            kodeverdi: "KP",
                            kodebeskrivelse: "Arealdel av kommuneplan"
                        }
                    },
                    {
                        navn: "Reguleringsplan for Sentrum Øst",
                        plantype: {
                            kodeverdi: "RP",
                            kodebeskrivelse: "Reguleringsplan for Sentrum Øst"
                        }
                    }
                ]
            },
            customSummation: {
                arealdisponering: {
                    tomtearealByggeomraade: 95.15,
                    tomtearealSomTrekkesFra: 59.6,
                    tomtearealSomLeggesTil: 36.2,
                    tomtearealBeregnet: 95.15,
                    beregnetMaksByggeareal: 59.6,
                    arealBebyggelseEksisterende: 36.2,
                    arealBebyggelseSomSkalRives: 95.15,
                    arealBebyggelseNytt: 59.6,
                    parkeringsarealTerreng: 36.2,
                    arealSumByggesak: 95.15,
                    beregnetGradAvUtnytting: 1.22
                },
                data: [
                    {
                        resourceValues: {
                            data: 80.25,
                            isTotal: false
                        },
                        resourceBindings: {
                            title: "resource.customSummation.areaBasis.title",
                            emptyFieldText: "resource.emptyFieldText.default",
                            unit: "resource.unit.meterSquared"
                        }
                    },
                    {
                        resourceValues: {
                            data: 20.15,
                            isTotal: false
                        },
                        resourceBindings: {
                            title: "resource.customSummation.areaMinus.title",
                            emptyFieldText: "resource.emptyFieldText.default",
                            operator: "resource.operator.minus",
                            unit: "resource.unit.meterSquared"
                        }
                    },
                    {
                        resourceValues: {
                            data: 60.1,
                            isTotal: true
                        },
                        resourceBindings: {
                            title: "resource.customSummation.areaEquals.title",
                            emptyFieldText: "resource.emptyFieldText.default",
                            operator: "resource.operator.equals",
                            unit: "resource.unit.meterSquared"
                        }
                    }
                ]
            },
            customGrouplist: {
                ettersending: [
                    {
                        tema: {
                            kodeverdi: "byggesak",
                            kodebeskrivelse: "Byggesak"
                        },
                        tittel: "Ettersendelse for byggesak",
                        kommentar: "Dette er en kommentar for byggesak ettersendelse.",
                        vedleggsliste: {
                            vedlegg: [
                                {
                                    vedleggstype: {
                                        kodeverdi: "VEDLEGGSTYPE1",
                                        kodebeskrivelse: "Vedleggstype 1"
                                    },
                                    filnavn: "dokument1.pdf"
                                }
                            ]
                        }
                    },
                    {
                        tema: {
                            kodeverdi: "plan",
                            kodebeskrivelse: "Plan"
                        },
                        tittel: "Ettersendelse for plan",
                        kommentar: "Dette er en kommentar for plan ettersendelse.",
                        vedleggsliste: {
                            vedlegg: [
                                {
                                    vedleggstype: {
                                        kodeverdi: "VEDLEGGSTYPE2",
                                        kodebeskrivelse: "Vedleggstype 2"
                                    },
                                    filnavn: "dokument2.pdf"
                                },
                                {
                                    vedleggstype: {
                                        kodeverdi: "VEDLEGGSTYPE3",
                                        kodebeskrivelse: "Vedleggstype 3"
                                    },
                                    filnavn: "dokument3.pdf"
                                }
                            ]
                        }
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
