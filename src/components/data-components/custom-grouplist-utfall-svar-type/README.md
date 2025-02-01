# Utfall svar (Group list)

| Property                                         | Type   | Description                                                                                           | Default value |
| :----------------------------------------------- | :----- | :---------------------------------------------------------------------------------------------------- | :------------ |
| id                                               | string | The unique identifier for the custom field.                                                           |               |
| type                                             | string | The type of the custom field, which is "Custom".                                                      |               |
| tagName                                          | string | The tag name for the custom field, which is "custom-grouplist-utfall-svar-type".                      |               |
| dataModelBindings.data                           | string | Reference to an array in the data model containing [UtfallSvar](../../classes/UtfallSvar.js) objects. |               |
| textResourceBindings.svv.header                  | string | The header text resource binding if utfallType.kodeverdi is "SVV".                                    |               |
| textResourceBindings.mkv.header                  | string | The header text resource binding if utfallType.kodeverdi is "MKV".                                    |               |
| textResourceBindings.status.title                | string | The title text resource binding for status field                                                      |               |
| textResourceBindings.erUtfallBesvaresSenere      | string | The text resource binding for whether the outcome will be answered later.                             |               |
| textResourceBindings.erUtfallBesvart             | string | The text resource binding for whether the outcome has been answered.                                  |               |
| textResourceBindings.status                      | string | The text resource binding for the status of the outcome.                                              |               |
| textResourceBindings.tema.kodebeskrivelse.title  | string | The title text resource binding for the theme code description.                                       |               |
| textResourceBindings.kommentar.title             | string | The title text resource binding for the comment field.                                                |               |
| textResourceBindings.vedleggsliste.vedlegg.title | string | The title text resource binding for the attachment list.                                              |               |

## Example

```json
{
    "id": "utfallBesvarelse-utfallSvar",
    "type": "Custom",
    "tagName": "custom-grouplist-utfall-svar-type",
    "dataModelBindings": {
        "data": "utfallBesvarelse.utfallSvar"
    },
    "textResourceBindings": {
        "svv.header": "resource.utfallBesvarelse.utfallSvar.svv.header",
        "mkv.header": "resource.utfallBesvarelse.utfallSvar.mkv.header",
        "status.title": "resource.utfallBesvarelse.utfallSvar.status.title",
        "erUtfallBesvaresSenere": "resource.utfallBesvarelse.utfallSvar.erUtfallBesvaresSenere",
        "erUtfallBesvart": "resource.utfallBesvarelse.utfallSvar.erUtfallBesvart",
        "status": "resource.utfallBesvarelse.utfallSvar.status",
        "tema.kodebeskrivelse.title": "resource.utfallBesvarelse.utfallSvar.tema.kodebeskrivelse.title",
        "kommentar.title": "resource.utfallBesvarelse.utfallSvar.kommentar.title",
        "vedleggsliste.vedlegg.title": "resource.utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg.title"
    }
}
```
