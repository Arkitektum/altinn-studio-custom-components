const markup = {
    id: "custom-gjennomfoeringsplan",
    type: "Custom",
    tagName: "custom-gjennomfoeringsplan",
    dataModelBindings: {
        versjon: "customLayout.gjennomfoeringsplan.versjon",
        gjennomfoeringsplan: "customLayout.gjennomfoeringsplan.gjennomfoeringsplan",
        metadata: "customLayout.gjennomfoeringsplan.metadata",
        kommunensSaksnummer: "customLayout.gjennomfoeringsplan.kommunensSaksnummer",
        eiendomByggested: "customLayout.gjennomfoeringsplan.eiendomByggested",
        ansvarligSoeker: "customLayout.gjennomfoeringsplan.ansvarligSoeker"
    }
};

const options = {
    pageOrientation: "landscape"
};

export default { markup, options };
