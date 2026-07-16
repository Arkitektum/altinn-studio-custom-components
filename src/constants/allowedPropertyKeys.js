export const allowedFormDataKeysForTypes = {
    base: ["data", "title"],
    data: ["data", "title", "dataTitle", "trueData", "falseData", "defaultData", "simpleBinding"],
    layout: [
        "ansvarligSoeker",
        "ansvarligSoekerTiltaksklasse",
        "begrunnelse",
        "bestemmelsestype",
        "dispensasjonOversikt",
        "dispensasjonsbeskrivelse",
        "dispensasjonsreferanse",
        "dispensasjonstema",
        "eiendomByggested",
        "generelleVilkaar",
        "gjennomfoeringsplan",
        "kommunensSaksnummer",
        "kontaktpersonForNabovarselet",
        "metadata",
        "naboGjenboerEiendommer",
        "nasjonalArealplanId",
        "paragrafnummer",
        "planer",
        "plannavn",
        "soeknadGjelder",
        "stedfesting",
        "tiltakshaver",
        "tiltakstyper",
        "varighet",
        "versjon"
    ]
};

export const allowedResourceValuesKeysForTypes = {
    base: ["data", "title"],
    data: ["data", "emptyFieldText", "title"],
    layout: []
};
