const markup = {
    id: "custom-grouplist-ettersending",
    type: "Custom",
    tagName: "custom-grouplist-ettersending",
    hideTitle: false,
    hideIfEmpty: false,
    size: "h2",
    dataModelBindings: {
        data: "grouplist.ettersending"
    },
    resourceBindings: {
        title: "resource.grouplist.ettersending.title",
        emptyFieldText: "resource.grouplist.ettersending.emptyFieldText.default"
    }
};
const defaultResourceBindings = {
    tema: {
        title: "resource.ettersendinger.ettersending.tema.kodebeskrivelse.title"
    },
    kommentar: {
        title: "resource.ettersendinger.ettersending.kommentar.title"
    },
    vedleggsliste: {
        title: "resource.ettersendinger.ettersending.vedleggsliste.vedlegg.title"
    },
    title: "resource.ettersendinger.title",
    emptyFieldText: "resource.emptyFieldText.default"
};

export default { markup, defaultResourceBindings };
