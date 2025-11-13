# Ansvarsområde (table)

| Property                                                                    | Type    | Description                                                                                   | Default value                                                         |
| :-------------------------------------------------------------------------- | :------ | :-------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| id                                                                          | string  | The unique identifier for the custom field.                                                   |                                                                       |
| type                                                                        | string  | The type of the custom field, which is "Custom".                                              |                                                                       |
| tagName                                                                     | string  | The tag name for the custom field, which is "custom-table-ansvarsomraade".                    |                                                                       |
| hideTitle                                                                   | boolean | A flag indicating whether the title should be hidden.                                         | false                                                                 |
| hideIfEmpty                                                                 | boolean | Determines whether the element should be hidden when it contains no content.                  | false                                                                 |
| size                                                                        | string  | The size of the header text (e.g., "h2", "h3", "h4").                                         | "h2"                                                                  |
| dataModelBindings.data                                                      | string  | Reference to an array or object in the data model containing values for the table             |                                                                       |
| resourceBindings.title                                                      | string  | The title text resource binding.                                                              | "resource.ansvarsfordeling.title"                                     |
| resourceBindings.emptyFieldText                                             | string  | The resource binding for the text to display when the field is empty.                         | "resource.emptyFieldText.default"                                     |
| resourceBindings.tiltaksklasse.title                                        | string  | The resource binding for the tiltaksklasse column title.                                      | "resource.tiltaksklasse.title"                                        |
| resourceBindings.tiltaksklasse.emptyFieldText                               | string  | The resource binding for the empty field text in the tiltaksklasse column.                    | "resource.emptyFieldText.default"                                     |
| resourceBindings.ansvarsomraade.title                                       | string  | The resource binding for the ansvarsområde column title.                                      | "resource.ansvarsomraade.title"                                       |
| resourceBindings.ansvarsomraade.emptyFieldText                              | string  | The resource binding for the empty field text in the ansvarsområde column.                    | "resource.emptyFieldText.default"                                     |
| resourceBindings.foretak.title                                              | string  | The resource binding for the foretak column title.                                            | "resource.foretak.title"                                              |
| resourceBindings.foretak.emptyFieldText                                     | string  | The resource binding for the empty field text in the foretak column.                          | "resource.emptyFieldText.default"                                     |
| resourceBindings.planlagteSamsvarKontrollErklaeringer.title                 | string  | The resource binding for the planlagte samsvar kontroll erklæringer column title.             | "resource.planlagteSamsvarKontrollErklaeringer.title"                 |
| resourceBindings.planlagteSamsvarKontrollErklaeringer.emptyFieldText        | string  | The resource binding for the empty field text in the planlagte samsvar column.                | "resource.emptyFieldText.default"                                     |
| resourceBindings.ansvarsomraadeStatus.title                                 | string  | The resource binding for the ansvarsområde status column title.                               | "resource.ansvarsomraadeStatus.title"                                 |
| resourceBindings.ansvarsomraadeStatus.emptyFieldText                        | string  | The resource binding for the empty field text in the ansvarsområde status column.             | "resource.emptyFieldText.default"                                     |
| resourceBindings.samsvarKontrollPlanlagtVedRammetillatelse.title            | string  | The resource binding for the samsvar kontroll planlagt ved rammetillatelse title.             | "resource.samsvarKontrollPlanlagtVedRammetillatelse.title"            |
| resourceBindings.samsvarKontrollPlanlagtVedIgangsettingstillatelse.title    | string  | The resource binding for the samsvar kontroll planlagt ved igangsettingstillatelse title.     | "resource.samsvarKontrollPlanlagtVedIgangsettingstillatelse.title"    |
| resourceBindings.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse.title | string  | The resource binding for the samsvar kontroll planlagt ved midlertidig brukstillatelse title. | "resource.samsvarKontrollPlanlagtVedMidlertidigBrukstillatelse.title" |
| resourceBindings.samsvarKontrollPlanlagtVedFerdigattest.title               | string  | The resource binding for the samsvar kontroll planlagt ved ferdigattest title.                | "resource.samsvarKontrollPlanlagtVedFerdigattest.title"               |

## Example

```json
{
    "id": "custom-table-ansvarsomraade",
    "type": "Custom",
    "tagName": "custom-table-ansvarsomraade",
    "hideIfEmpty": true,
    "hideTitle": false,
    "dataModelBindings": {
        "data": "ansvarsomraade"
    }
}
```
