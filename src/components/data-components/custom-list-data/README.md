# Data (list)

| Property                        | Type              | Description                                                                                                                      | Default value |
| :------------------------------ | :---------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| id                              | string            | The unique identifier for the custom field.                                                                                      |               |
| type                            | string            | The type of the custom field, which is "Custom".                                                                                 |               |
| tagName                         | string            | The tag name for the custom field, which is "custom-list-data".                                                                  |               |
| hideTitle                       | boolean           | A flag indicating whether the title should be hidden.                                                                            | false         |
| hideIfEmpty                     | boolean           | Determines whether the element should be hidden when it contains no content.                                                     | false         |
| itemKey                         | string            | The key used to identify each item in the list if the array in dataModelBindings.data contains objects.                          |               |
| dataModelBindings.data          | string            | Reference to an array in the data model. If the array contains objects, use itemKey to reference a property with a string value. |               |
| resourceBindings.title          | string            | The title text resource binding.                                                                                                 |               |
| resourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                                                            |               |
| styleOverride                   | HTMLElement.style | The style override for the custom field.                                                                                         |               |

## Example

```json
{
    "id": "soeknadGjelder-type-kode",
    "type": "Custom",
    "tagName": "custom-list-data",
    "hideTitle": true,
    "hideIfEmpty": false,
    "itemKey": "kodebeskrivelse",
    "dataModelBindings": {
        "data": "soeknadGjelder.type.kode"
    },
    "resourceBindings": {
        "title": "resource.soeknadGjelder.type.kode.header",
        "emptyFieldText": "resource.emptyFieldText.default"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
