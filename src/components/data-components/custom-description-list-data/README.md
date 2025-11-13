# Data (description list)

| Property                        | Type              | Description                                                                                                                                   | Default value |
| :------------------------------ | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| id                              | string            | The unique identifier for the custom field.                                                                                                   |               |
| type                            | string            | The type of the custom field, which is "Custom".                                                                                              |               |
| tagName                         | string            | The tag name for the custom field, which is "custom-description-list-data".                                                                   |               |
| hideTitle                       | boolean           | A flag indicating whether the title should be hidden.                                                                                         | false         |
| hideIfEmpty                     | boolean           | Determines whether the element should be hidden when it contains no content.                                                                  | false         |
| itemTermKey                     | string            | The key used to reference the term (label) property in each item of the data array.                                                           |               |
| itemDescriptionKey              | string            | The key used to reference the description property in each item of the data array.                                                            |               |
| dataModelBindings.data          | string            | Reference to an array in the data model. Use `itemTermKey` and `itemDescriptionKey` to reference the string value properties inside the item. |               |
| resourceBindings.title          | string            | The title text resource binding.                                                                                                              |               |
| resourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                                                                         |               |
| styleOverride                   | HTMLElement.style | The style override for the custom field.                                                                                                      |               |

## Example

```json
{
    "id": "custom-description-list-data",
    "type": "Custom",
    "tagName": "custom-description-list-data",
    "hideTitle": false,
    "hideIfEmpty": true,
    "itemTermKey": "title",
    "itemDescriptionKey": "description",
    "dataModelBindings": {
        "data": "descriptions"
    },
    "resourceBindings": {
        "title": "resource.descriptions.title",
        "emptyFieldText": "resource.emptyFieldText.default"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
