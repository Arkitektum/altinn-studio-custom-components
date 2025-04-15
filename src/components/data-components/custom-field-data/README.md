# Data (field)

| Property                            | Type              | Description                                                                         | Default value |
| :---------------------------------- | :---------------- | :---------------------------------------------------------------------------------- | :------------ |
| id                                  | string            | The unique identifier for the custom field.                                         |               |
| type                                | string            | The type of the custom field, which is "Custom".                                    |               |
| tagName                             | string            | The tag name for the custom field, which is "custom-field-data".                    |               |
| hideTitle                           | boolean           | A flag indicating whether the title should be hidden.                               | false         |
| hideIfEmpty                         | boolean           | Determines whether the element should be hidden when it contains no content.        | false         |
| format                              | string            | The format of the data value, e.g., "date", "time", etc.                            |               |
| inline                              | boolean           | A flag indicating whether the title and value should be displayed on the same line. | false         |
| dataModelBindings.simpleBinding     | string            | Reference to a string, number og boolean value in the data model.                   |               |
| textResourceBindings.title          | string            | The title text resource binding.                                                    |               |
| textResourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.               |               |
| styleOverride                       | HTMLElement.style | The style override for the custom field.                                            |               |

## Example

```json
{
    "id": "ansvarligSoeker-navn",
    "type": "Custom",
    "tagName": "custom-field-data",
    "hideTitle": true,
    "hideIfEmpty": false,
    "inline": false,
    "format": "date",
    "dataModelBindings": {
        "simpleBinding": "soeknadGjelder.delsoeknadsnummer"
    },
    "textResourceBindings": {
        "title": "resource.soeknadGjelder.delsoeknadsnummer.header",
        "emptyFieldText": "resource.emptyFieldText.default"
    },
    "styleOverride": {
        "width": "150px"
    }
}
```
