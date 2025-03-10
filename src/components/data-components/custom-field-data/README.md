# Data (field)

| Property                        | Type              | Description                                                                         | Default value |
| :------------------------------ | :---------------- | :---------------------------------------------------------------------------------- | :------------ |
| id                              | string            | The unique identifier for the custom field.                                         |               |
| type                            | string            | The type of the custom field, which is "Custom".                                    |               |
| tagName                         | string            | The tag name for the custom field, which is "custom-field-data".                    |               |
| hideTitle                       | boolean           | A flag indicating whether the title should be hidden.                               | false         |
| hideIfEmpty                     | boolean           | Determines whether the element should be hidden when it contains no content.        | false         |
| emptyFieldText                  | string            | The text to display when the field is empty.                                        |               |
| format                          | string            | The format of the data value, e.g., "date", "time", etc.                            |               |
| inline                          | boolean           | A flag indicating whether the title and value should be displayed on the same line. | false         |
| dataModelBindings.simpleBinding | string            | Reference to a string, number og boolean value in the data model.                   |               |
| textResourceBindings.title      | string            | The title text resource binding.                                                    |               |
| styleOverride                   | HTMLElement.style | The style override for the custom field.                                            |               |

## Example

```json
{
    "id": "ansvarligSoeker-navn",
    "type": "Custom",
    "tagName": "custom-field-data",
    "hideTitle": true,
    "hideIfEmpty": false,
    "emptyFieldText": "-",
    "inline": false,
    "format": "date",
    "dataModelBindings": {
        "simpleBinding": "soeknadGjelder.delsoeknadsnummer"
    },
    "textResourceBindings": {
        "title": "resource.soeknadGjelder.delsoeknadsnummer.header"
    },
    "styleOverride": {
        "width": "150px"
    }
}
```
