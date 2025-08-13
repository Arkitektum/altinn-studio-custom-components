# Boolean data (field)

| Property                        | Type              | Description                                                                         | Default value |
| :------------------------------ | :---------------- | :---------------------------------------------------------------------------------- | :------------ |
| id                              | string            | The unique identifier for the custom field.                                         |               |
| type                            | string            | The type of the custom field, which is "Custom".                                    |               |
| tagName                         | string            | The tag name for the custom field, which is "custom-field-boolean-data".            |               |
| hideTitle                       | boolean           | A flag indicating whether the title should be hidden.                               | false         |
| hideIfEmpty                     | boolean           | Determines whether the element should be hidden when it contains no content.        | false         |
| inline                          | boolean           | A flag indicating whether the title and value should be displayed on the same line. | false         |
| dataModelBindings.simpleBinding | boolean           | Reference to a boolean value in the data model.                                     |               |
| dataModelBindings.trueData      | boolean           | Reference to the data model value when the field is set to true.                    |               |
| dataModelBindings.falseData     | boolean           | Reference to the data model value when the field is set to false.                   |               |
| dataModelBindings.defaultData   | boolean           | Reference to the default data model value when no specific value is set.            |               |
| resourceBindings.title          | string            | The title text resource binding.                                                    |               |
| resourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.               |               |
| styleOverride                   | HTMLElement.style | The style override for the custom field.                                            |               |

## Example

```json
{
    "id": "soeknadGjelder-gjelderHeleTiltaket",
    "type": "Custom",
    "tagName": "custom-field-boolean-data",
    "hideTitle": false,
    "hideIfEmpty": false,
    "inline": false,
    "dataModelBindings": {
        "simpleBinding": "condition",
        "trueData": "dispensasjon?.dispensasjonBeskrivelse?.annenInngangsbeskrivelse",
        "falseData": "dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse",
        "defaultData": "dispensasjon?.dispensasjonBeskrivelse?.inngangsbeskrivelse?.kodebeskrivelse"
    },
    "resourceBindings": {
        "title": "resource.eiendomByggested.eiendom.bygningsnummer.title",
        "emptyFieldText": "resource.emptyFieldText.default"
    }
}
```
