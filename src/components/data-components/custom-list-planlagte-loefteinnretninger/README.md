# Planlagte løfteinnretninger (list)

| Property                                         | Type              | Description                                                                                                                        | Default value                                                                  |
| :----------------------------------------------- | :---------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| id                                               | string            | The unique identifier for the custom field.                                                                                        |                                                                                |
| type                                             | string            | The type of the custom field, which is "Custom".                                                                                   |                                                                                |
| tagName                                          | string            | The tag name for the custom field, which is "custom-list-planlagte-loefteinnretninger".                                            |                                                                                |
| hideIfEmpty                                      | boolean           | Determines whether the element should be hidden when it contains no content.                                                       | false                                                                          |
| dataModelBindings.data                           | string            | Reference to an array in the data model containing [Loefteinnretninger](../../classes/data-classes/Loefteinnretninger.js) objects. |                                                                                |
| resourceBindings.emptyFieldText                  | string            | The resource binding for the text to display when the field is empty.                                                              |                                                                                |
| resourceBindings.planleggesHeis.title            | string            | The resource binding for the title of the planned elevator field.                                                                  | "resource.rammebetingelser.loefteinnretninger.planleggesHeis.title"            |
| resourceBindings.planleggesLoefteplattform.title | string            | The resource binding for the title of the planned lift platform field.                                                             | "resource.rammebetingelser.loefteinnretninger.planleggesLoefteplattform.title" |
| resourceBindings.planleggesRulletrapp.title      | string            | The resource binding for the title of the planned escalator field.                                                                 | "resource.rammebetingelser.loefteinnretninger.planleggesRulletrapp.title"      |
| resourceBindings.planleggesTrappeheis.title      | string            | The resource binding for the title of the planned stairlift field.                                                                 | "resource.rammebetingelser.loefteinnretninger.planleggesTrappeheis.title"      |
| styleOverride                                    | HTMLElement.style | The style override for the custom field.                                                                                           |                                                                                |

## Example

```json
{
    "id": "rammebetingelser-loefteinnretninger-planlagteLoefteinnretninger",
    "type": "Custom",
    "tagName": "custom-list-planlagte-loefteinnretninger",
    "hideIfEmpty": false,
    "dataModelBindings": {
        "data": "utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg"
    },
    "resourceBindings": {
        "emptyFieldText": "resource.loefteinnretninger.emptyFieldText"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
