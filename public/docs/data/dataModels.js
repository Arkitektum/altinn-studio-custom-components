import customDescriptionListData from "../components/description-list/custom-description-list-data";

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
            customDescriptionList: {
                data: [
                    { event: "Konferanse", date: "2023-09-15" },
                    { event: "Workshop", date: "2023-10-20" },
                    { event: "Webinar", date: "2023-11-05" }
                ]
            },
            customTable: {
                ansvarsomraade: [
                    {
                        funksjon: {
                            kodeverdi: "KONTROLL",
                            kodebeskrivelse: "Ansvarlig kontrollerende"
                        },
                        ansvarsomraade: "Strukturell sikkerhet",
                        tiltaksklasse: {
                            kodeverdi: "1",
                            kodebeskrivelse: "1"
                        },
                        foretak: {
                            partstype: {
                                kodeverdi: "Foretak",
                                kodebeskrivelse: "Foretak"
                            },
                            foedselsnummer: null,
                            organisasjonsnummer: "987654321",
                            navn: "Kontrollforetak AS",
                            adresse: {
                                adresselinje1: "Kontrollvegen 3",
                                adresselinje2: null,
                                adresselinje3: null,
                                postnr: "4321",
                                poststed: "Kontrollbyen",
                                landkode: "NO"
                            },
                            telefonnummer: "22334455",
                            mobilnummer: "99887766",
                            epost: "kontakt@kontrollforetak.no"
                        },
                        samsvarKontrollPlanlagtVedRammetillatelse: true,
                        samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
                        samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: false,
                        samsvarKontrollPlanlagtVedFerdigattest: false,
                        samsvarKontrollForeliggerVedRammetillatelse: "2023-05-28",
                        samsvarKontrollForeliggerVedIgangsettingstillatelse: "2023-06-28",
                        samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "",
                        samsvarKontrollForeliggerVedFerdigattest: "",
                        ansvarsomraadeStatus: {
                            kodeverdi: "avsluttet",
                            kodebeskrivelse: "Avsluttet"
                        }
                    },
                    {
                        funksjon: {
                            kodeverdi: "UTFØRENDE",
                            kodebeskrivelse: "Ansvarlig utførende"
                        },
                        ansvarsomraade: "Brannsikkerhet",
                        tiltaksklasse: {
                            kodeverdi: "2",
                            kodebeskrivelse: "2"
                        },
                        foretak: {
                            partstype: {
                                kodeverdi: "Foretak",
                                kodebeskrivelse: "Foretak"
                            },
                            foedselsnummer: null,
                            organisasjonsnummer: "123123123",
                            navn: "Utførende Foretak AS",
                            adresse: {
                                adresselinje1: "Utførervegen 4",
                                adresselinje2: null,
                                adresselinje3: null,
                                postnr: "5678",
                                poststed: "Utførerbyen",
                                landkode: "NO"
                            },
                            telefonnummer: "33445566",
                            mobilnummer: "88776655",
                            epost: "kontakt@utforendeforetak.no"
                        },
                        samsvarKontrollPlanlagtVedRammetillatelse: false,
                        samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
                        samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: true,
                        samsvarKontrollPlanlagtVedFerdigattest: true,
                        samsvarKontrollForeliggerVedRammetillatelse: "",
                        samsvarKontrollForeliggerVedIgangsettingstillatelse: "2023-07-15",
                        samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "2023-08-20",
                        samsvarKontrollForeliggerVedFerdigattest: "2023-09-30",
                        ansvarsomraadeStatus: {
                            kodeverdi: "pågående",
                            kodebeskrivelse: "Pågående"
                        }
                    }
                ],
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
                ansvarsomraade: [
                    {
                        funksjon: {
                            kodeverdi: "KONTROLL",
                            kodebeskrivelse: "Ansvarlig kontrollerende"
                        },
                        ansvarsomraade: "Strukturell sikkerhet",
                        tiltaksklasse: {
                            kodeverdi: "1",
                            kodebeskrivelse: "1"
                        },
                        foretak: {
                            partstype: {
                                kodeverdi: "Foretak",
                                kodebeskrivelse: "Foretak"
                            },
                            foedselsnummer: null,
                            organisasjonsnummer: "987654321",
                            navn: "Kontrollforetak AS",
                            adresse: {
                                adresselinje1: "Kontrollvegen 3",
                                adresselinje2: null,
                                adresselinje3: null,
                                postnr: "4321",
                                poststed: "Kontrollbyen",
                                landkode: "NO"
                            },
                            telefonnummer: "22334455",
                            mobilnummer: "99887766",
                            epost: "kontakt@kontrollforetak.no"
                        },
                        samsvarKontrollPlanlagtVedRammetillatelse: true,
                        samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
                        samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: false,
                        samsvarKontrollPlanlagtVedFerdigattest: false,
                        samsvarKontrollForeliggerVedRammetillatelse: "2023-05-28",
                        samsvarKontrollForeliggerVedIgangsettingstillatelse: "2023-06-28",
                        samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "",
                        samsvarKontrollForeliggerVedFerdigattest: "",
                        ansvarsomraadeStatus: {
                            kodeverdi: "avsluttet",
                            kodebeskrivelse: "Avsluttet"
                        }
                    },
                    {
                        funksjon: {
                            kodeverdi: "UTFØRENDE",
                            kodebeskrivelse: "Ansvarlig utførende"
                        },
                        ansvarsomraade: "Brannsikkerhet",
                        tiltaksklasse: {
                            kodeverdi: "2",
                            kodebeskrivelse: "2"
                        },
                        foretak: {
                            partstype: {
                                kodeverdi: "Foretak",
                                kodebeskrivelse: "Foretak"
                            },
                            foedselsnummer: null,
                            organisasjonsnummer: "123123123",
                            navn: "Utførende Foretak AS",
                            adresse: {
                                adresselinje1: "Utførervegen 4",
                                adresselinje2: null,
                                adresselinje3: null,
                                postnr: "5678",
                                poststed: "Utførerbyen",
                                landkode: "NO"
                            },
                            telefonnummer: "33445566",
                            mobilnummer: "88776655",
                            epost: "kontakt@utforendeforetak.no"
                        },
                        samsvarKontrollPlanlagtVedRammetillatelse: false,
                        samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
                        samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: true,
                        samsvarKontrollPlanlagtVedFerdigattest: true,
                        samsvarKontrollForeliggerVedRammetillatelse: "",
                        samsvarKontrollForeliggerVedIgangsettingstillatelse: "2023-07-15",
                        samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "2023-08-20",
                        samsvarKontrollForeliggerVedFerdigattest: "2023-09-30",
                        ansvarsomraadeStatus: {
                            kodeverdi: "pågående",
                            kodebeskrivelse: "Pågående"
                        }
                    },
                    {
                        funksjon: {
                            kodeverdi: "KONTROLL",
                            kodebeskrivelse: "Ansvarlig kontrollerende"
                        },
                        ansvarsomraade: "Geoteknisk sikkerhet",
                        tiltaksklasse: {
                            kodeverdi: "3",
                            kodebeskrivelse: "3"
                        },
                        foretak: {
                            partstype: {
                                kodeverdi: "Foretak",
                                kodebeskrivelse: "Foretak"
                            },
                            foedselsnummer: null,
                            organisasjonsnummer: "555666777",
                            navn: "Geoteknisk Kontroll AS",
                            adresse: {
                                adresselinje1: "Geovegen 5",
                                adresselinje2: null,
                                adresselinje3: null,
                                postnr: "8765",
                                poststed: "Geobyen",
                                landkode: "NO"
                            },
                            telefonnummer: "44556677",
                            mobilnummer: "77665544",
                            epost: "kontakt@geotekniskkontroll.no"
                        },
                        samsvarKontrollPlanlagtVedRammetillatelse: true,
                        samsvarKontrollPlanlagtVedIgangsettingstillatelse: false,
                        samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: true,
                        samsvarKontrollPlanlagtVedFerdigattest: false,
                        samsvarKontrollForeliggerVedRammetillatelse: "2023-10-10",
                        samsvarKontrollForeliggerVedIgangsettingstillatelse: "",
                        samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "2023-12-01",
                        samsvarKontrollForeliggerVedFerdigattest: "",
                        ansvarsomraadeStatus: {
                            kodeverdi: "planlagt",
                            kodebeskrivelse: "Planlagt"
                        }
                    }
                ],
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
                ],
                sjekklistekrav: [
                    {
                        sjekklistepunktsvar: true,
                        sjekklistepunkt: {
                            kodeverdi: "1.15",
                            kodebeskrivelse: "Sjekklistepunkt 1.15 beskrivelse"
                        },
                        dokumentasjon: "Dokumentasjon for sjekklistepunkt 1.15"
                    },
                    {
                        sjekklistepunktsvar: false,
                        sjekklistepunkt: {
                            kodeverdi: "2.3",
                            kodebeskrivelse: "Sjekklistepunkt 2.3 beskrivelse"
                        },
                        dokumentasjon: "Dokumentasjon for sjekklistepunkt 2.3"
                    },
                    {
                        sjekklistepunktsvar: true,
                        sjekklistepunkt: {
                            kodeverdi: "3.7",
                            kodebeskrivelse: "Sjekklistepunkt 3.7 beskrivelse"
                        },
                        dokumentasjon: "Dokumentasjon for sjekklistepunkt 3.7"
                    }
                ],
                utfallSvar: [
                    {
                        utfallId: "1",
                        utfallType: {
                            kodeverdi: "svv",
                            kodebeskrivelse: "Svar på vilkår for midlertidig brukstillatelse"
                        },
                        utloestFraSjekkpunkt: {
                            sjekkpunktId: "SP1",
                            sjekkpunktEier: "System"
                        },
                        tema: {
                            kodeverdi: "byggesak",
                            kodebeskrivelse: "Byggesak"
                        },
                        tittel: "Utfall svar for byggesak",
                        beskrivelse: "Dette er en beskrivelse av utfall svar for byggesak.",
                        erUtfallBesvaresSenere: false,
                        erUtfallBesvart: true,
                        kommentar: "Kommentar til utfall svar for byggesak.",
                        vedleggsliste: {
                            vedlegg: [
                                {
                                    versjonsnummer: "1",
                                    vedleggstype: {
                                        kodeverdi: "VEDLEGGSTYPE_A",
                                        kodebeskrivelse: "Vedleggstype A"
                                    },
                                    versjonsdato: "2025-05-06T00:00:02",
                                    filnavn: "dokumentA.pdf"
                                },
                                {
                                    versjonsnummer: "1",
                                    vedleggstype: {
                                        kodeverdi: "VEDLEGGSTYPE_B",
                                        kodebeskrivelse: "Vedleggstype B"
                                    },
                                    versjonsdato: "2025-05-06T00:00:03",
                                    filnavn: "dokumentB.pdf"
                                }
                            ]
                        }
                    },
                    {
                        utfallId: "2",
                        utfallType: {
                            kodeverdi: "mkv",
                            kodebeskrivelse: "Svar på oppfølgingspunkt for midlertidig brukstillatelse"
                        },
                        utloestFraSjekkpunkt: {
                            sjekkpunktId: "SP2",
                            sjekkpunktEier: "System"
                        },
                        tema: {
                            kodeverdi: "plan",
                            kodebeskrivelse: "Plan"
                        },
                        tittel: "Utfall svar for plan",
                        beskrivelse: "Dette er en beskrivelse av utfall svar for plan.",
                        erUtfallBesvaresSenere: true,
                        erUtfallBesvart: false,
                        kommentar: "Kommentar til utfall svar for plan.",
                        vedleggsliste: {
                            vedlegg: []
                        }
                    },
                    {
                        utfallId: "3",
                        utfallType: {
                            kodeverdi: "svv",
                            kodebeskrivelse: "Svar på vilkår for midlertidig brukstillatelse"
                        },
                        utloestFraSjekkpunkt: {
                            sjekkpunktId: "SP3",
                            sjekkpunktEier: "System"
                        },
                        tema: {
                            kodeverdi: "byggesak",
                            kodebeskrivelse: "Byggesak"
                        },
                        tittel: "Utfall svar 2 for byggesak",
                        beskrivelse: "Dette er en annen beskrivelse av utfall svar for byggesak.",
                        erUtfallBesvaresSenere: false,
                        erUtfallBesvart: true,
                        kommentar: "En annen kommentar til utfall svar for byggesak.",
                        vedleggsliste: {
                            vedlegg: [
                                {
                                    versjonsnummer: "1",
                                    vedleggstype: {
                                        kodeverdi: "VEDLEGGSTYPE_C",
                                        kodebeskrivelse: "Vedleggstype C"
                                    },
                                    versjonsdato: "2025-05-06T00:00:04",
                                    filnavn: "dokumentC.pdf"
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
            },
            customLayout: {
                dispensasjon: {
                    dispensasjonBeskrivelse: {
                        dispensasjonTittel: {
                            kodeverdi: "byggeGrense",
                            kodebeskrivelse: "Byggegrenser"
                        },
                        inngangsbeskrivelse: {
                            kodeverdi: "byggeLinje",
                            kodebeskrivelse: "Vi vil plassere tiltaket utenfor regulert byggelinje"
                        },
                        annenInngangsbeskrivelse: "Jeg vil bygge i en sikrings-, støy- og faresone",
                        beskrivelse:
                            "Vi ønsker å plassere garasjen 4,9 meter fra tomtegrensen mot veien, for å unngå å felle det fine eiketreet i hagen."
                    },
                    dispensasjonReferanse: "89fa33df-079a-407c-8371-4e85df5cf418",
                    soeknadstype: {
                        kodeverdi: "NV",
                        kodebeskrivelse: "Nabovarsel"
                    },
                    kommunensSaksnummer: {
                        saksaar: 2024,
                        sakssekvensnummer: 12345
                    },
                    metadata: {
                        fraSluttbrukersystem: "eByggesøknadssystem X",
                        ftbId: "FTB123",
                        prosjektnavn: "Eksempelsak Dispensasjon",
                        prosjektnr: "2024-54-A",
                        foretrukketSpraak: {
                            kodeverdi: "nb",
                            kodebeskrivelse: "Bokmål"
                        }
                    },
                    tiltakshaver: {
                        partstype: {
                            kodeverdi: "Foretak",
                            kodebeskrivelse: "Foretak"
                        },
                        foedselsnummer: null,
                        organisasjonsnummer: "123456789",
                        navn: "Organisasjon AS",
                        adresse: {
                            adresselinje1: "Organisasjonsvegen 1",
                            adresselinje2: null,
                            adresselinje3: null,
                            postnr: "1234",
                            poststed: "Eksempelbyen",
                            landkode: "NO"
                        },
                        telefonnummer: "111223344",
                        mobilnummer: "12034043",
                        epost: "eksempel@organisasjon.no"
                    },
                    ansvarligSoeker: {
                        partstype: {
                            kodeverdi: "Person",
                            kodebeskrivelse: "Person"
                        },
                        foedselsnummer: "01020312345",
                        organisasjonsnummer: null,
                        navn: "Ola Nordmann",
                        adresse: {
                            adresselinje1: "Søkervegen 2",
                            adresselinje2: null,
                            adresselinje3: null,
                            postnr: "5678",
                            poststed: "Søkerbyen",
                            landkode: "NO"
                        },
                        telefonnummer: "99887766",
                        mobilnummer: "91234567",
                        epost: "ola.nordmann@eksempel.no",
                        kontaktperson: {
                            navn: "Kari Nordmann",
                            telefonnummer: "99887766",
                            mobilnummer: "91234567",
                            epost: "kari.nordmann@eksempel.no"
                        }
                    },
                    eiendomByggested: {
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
                    tiltakstyper: {
                        type: [
                            {
                                kodeverdi: "nybygg",
                                kodebeskrivelse: "Nybygg"
                            },
                            {
                                kodeverdi: "tilbygg",
                                kodebeskrivelse: "Tilbygg"
                            }
                        ]
                    },
                    dispensasjonFra: {
                        bestemmelserType: {
                            kodeverdi: "reguleringsPlan",
                            kodebeskrivelse: "Reguleringsplan"
                        },
                        dispensasjonPlanBestemmelse: {
                            navn: "Reguleringsplan for Sentrum Øst",
                            nasjonalArealplanId: {
                                administrativEnhet: "0301",
                                planidentifikasjon: "RP-2020-1234"
                            },
                            planbestemmelse: {
                                nummerering: "8-9",
                                overskrift: "Byggegrenser og plassering",
                                bestemmelsestekst: "Bygninger skal plasseres innenfor angitte byggegrenser på plankartet."
                            },
                            gradAvUtnytting: "17",
                            beregningsregelGradAvUtnytting: {
                                kodeverdi: "annet",
                                kodebeskrivelse: "Annet i m2"
                            }
                        },
                        lovbestemmelse: "§ 29-4 i plan- og bygningsloven"
                    },
                    stedfesting: {
                        posisjon: {
                            type: null,
                            koordinatsystem: {
                                kodeverdi: "EPSG:25835",
                                kodebeskrivelse: "EUREF89 UTM sone 35"
                            },
                            koordinater: {
                                koordinat: [57.9139, 13.7522]
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
                        hensynBakBestemmelsen: "Bestemmelsen er satt for å sikre tilstrekkelig avstand til vei og naboeiendommer",
                        vurderingHensynBakBestemmelsen:
                            "I dette tilfellet vil plassering utenfor byggegrensen ikke medføre ulempe for omkringliggende eiendommer eller trafikk.",
                        vurderingHensynOverordnet: "Nasjonale og regionale interesser blir ikke vesentlig tilsidesatt av av endringen.",
                        fordeler: {
                            effekt: ["Bedre utnyttelse av tomten", "Bevaring av eksisterende trær og grøntområder"]
                        },
                        ulemper: {
                            effekt: ["Redusert mulighet for fremtidig utvidelse av veien"]
                        },
                        samletBegrunnelse: "Etter en helhetsvurdering mener vi at fordelene ved å gi dispensasjon veier tyngre enn ulempene."
                    },
                    generelleVilkaar: {
                        norskSvenskDansk: true
                    }
                },
                gjennomfoeringsplan: {
                    versjon: "1.0",
                    gjennomfoeringsplan: {
                        ansvarsomraade: [
                            {
                                funksjon: {
                                    kodeverdi: "KONTROLL",
                                    kodebeskrivelse: "Ansvarlig kontrollerende"
                                },
                                ansvarsomraade: "Strukturell sikkerhet",
                                tiltaksklasse: {
                                    kodeverdi: "1",
                                    kodebeskrivelse: "1"
                                },
                                foretak: {
                                    partstype: {
                                        kodeverdi: "Foretak",
                                        kodebeskrivelse: "Foretak"
                                    },
                                    foedselsnummer: null,
                                    organisasjonsnummer: "987654321",
                                    navn: "Kontrollforetak AS",
                                    adresse: {
                                        adresselinje1: "Kontrollvegen 3",
                                        adresselinje2: null,
                                        adresselinje3: null,
                                        postnr: "4321",
                                        poststed: "Kontrollbyen",
                                        landkode: "NO"
                                    },
                                    telefonnummer: "22334455",
                                    mobilnummer: "99887766",
                                    epost: "kontakt@kontrollforetak.no"
                                },
                                samsvarKontrollPlanlagtVedRammetillatelse: true,
                                samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
                                samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: false,
                                samsvarKontrollPlanlagtVedFerdigattest: false,
                                samsvarKontrollForeliggerVedRammetillatelse: "2023-05-28",
                                samsvarKontrollForeliggerVedIgangsettingstillatelse: "2023-06-28",
                                samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "",
                                samsvarKontrollForeliggerVedFerdigattest: "",
                                ansvarsomraadeStatus: {
                                    kodeverdi: "avsluttet",
                                    kodebeskrivelse: "Avsluttet"
                                }
                            },
                            {
                                funksjon: {
                                    kodeverdi: "UTFØRENDE",
                                    kodebeskrivelse: "Ansvarlig utførende"
                                },
                                ansvarsomraade: "Brannsikkerhet",
                                tiltaksklasse: {
                                    kodeverdi: "2",
                                    kodebeskrivelse: "2"
                                },
                                foretak: {
                                    partstype: {
                                        kodeverdi: "Foretak",
                                        kodebeskrivelse: "Foretak"
                                    },
                                    foedselsnummer: null,
                                    organisasjonsnummer: "123123123",
                                    navn: "Utførende Foretak AS",
                                    adresse: {
                                        adresselinje1: "Utførervegen 4",
                                        adresselinje2: null,
                                        adresselinje3: null,
                                        postnr: "5678",
                                        poststed: "Utførerbyen",
                                        landkode: "NO"
                                    },
                                    telefonnummer: "33445566",
                                    mobilnummer: "88776655",
                                    epost: "kontakt@utforendeforetak.no"
                                },
                                samsvarKontrollPlanlagtVedRammetillatelse: false,
                                samsvarKontrollPlanlagtVedIgangsettingstillatelse: true,
                                samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse: true,
                                samsvarKontrollPlanlagtVedFerdigattest: true,
                                samsvarKontrollForeliggerVedRammetillatelse: "",
                                samsvarKontrollForeliggerVedIgangsettingstillatelse: "2023-07-15",
                                samsvarKontrollForeliggerVedMidlertidigBrukstillatelse: "2023-08-20",
                                samsvarKontrollForeliggerVedFerdigattest: "2023-09-30",
                                ansvarsomraadeStatus: {
                                    kodeverdi: "pågående",
                                    kodebeskrivelse: "Pågående"
                                }
                            }
                        ]
                    },
                    metadata: {
                        fraSluttbrukersystem: "eByggesøknadssystem Y",
                        ftbId: "FTB456",
                        prosjektnavn: "Eksempelsak Gjennomføringsplan",
                        sluttbrukersystemUrl: "https://ebs.eksempel.no/sak/78910",
                        hovedinnsendingsnummer: "2024-78910-A"
                    },
                    kommunensSaksnummer: {
                        saksaar: "2004",
                        sakssekvensnummer: "456"
                    },
                    eiendomByggested: {
                        eiendom: [
                            {
                                eiendomsidentifikasjon: {
                                    kommunenummer: "5678",
                                    gaardsnummer: 44,
                                    bruksnummer: 22,
                                    festenummer: 0,
                                    seksjonsnummer: 0
                                },
                                adresse: {
                                    adresselinje1: "Byggestedvegen 5",
                                    adresselinje2: "",
                                    adresselinje3: "",
                                    postnr: "5678",
                                    poststed: "Byggestedbyen",
                                    landkode: "NO",
                                    gatenavn: "Byggestedvegen",
                                    husnr: "5",
                                    bokstav: ""
                                },
                                bygningsnummer: "6543210",
                                bolignummer: "H0201",
                                kommunenavn: "Bergen"
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
                    ansvarligSoeker: {
                        partstype: {
                            kodeverdi: "Person",
                            kodebeskrivelse: "Person"
                        },
                        foedselsnummer: "02030456789",
                        organisasjonsnummer: null,
                        navn: "Kari Nordmann",
                        adresse: {
                            adresselinje1: "Søkervegen 3",
                            adresselinje2: null,
                            adresselinje3: null,
                            postnr: "5678",
                            poststed: "Søkerbyen",
                            landkode: "NO"
                        },
                        telefonnummer: "88776655",
                        mobilnummer: "91234567",
                        epost: "kari.nordmann@example.com"
                    }
                }
            }
        }
    }
];
