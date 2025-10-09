# Data (list)

| Property                        | Type              | Description                                                                                                              | Default value |
| :------------------------------ | :---------------- | :----------------------------------------------------------------------------------------------------------------------- | :------------ |
| id                              | string            | The unique identifier for the custom field.                                                                              |               |
| type                            | string            | The type of the custom field, which is "Custom".                                                                         |               |
| tagName                         | string            | The tag name for the custom field, which is "custom-list-data".                                                          |               |
| hideTitle                       | boolean           | A flag indicating whether the title should be hidden.                                                                    | false         |
| hideIfEmpty                     | boolean           | Determines whether the element should be hidden when it contains no content.                                             | false         |
| dataModelBindings.data          | string            | Reference to an array in the data model. If the array contains objects, itterate "kodebeskrivelse".                      |               |
| dataModelBindings.simpleBinding | string            | Reference to a field in the data model. If the field contains data, it will be displayed behind "Annet" from data array. |               |
| resourceBindings.title          | string            | The title text resource binding.                                                                                         |               |
| resourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                                                    |               |
| styleOverride                   | HTMLElement.style | The style override for the custom field.                                                                                 |               |

## Example

```json
{
    "id": "soeknadGjelder-bruk-tiltaksformaal-kodebeskrivelse",
    "type": "Custom",
    "tagName": "custom-list-tiltaks-formaal",
    "hideTitle": false,
    "hideIfEmpty": false,
    "itemKey": "kodebeskrivelse",
    "resourceBindings": {
        "title": "resource.soeknadGjelder.bruk.tiltaksformaal.kode.kodebeskrivelse"
    },
    "dataModelBindings": {
        "simpleBinding": "soeknadGjelder.bruk.beskrivPlanlagtFormaal",
        "data": "soeknadGjelder.bruk.tiltaksformaal.kode"
    }
}
```
