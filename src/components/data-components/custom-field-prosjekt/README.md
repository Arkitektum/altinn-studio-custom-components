# Prosjekt (field)

| Property                        | Type              | Description                                                                                  | Default value |
| :------------------------------ | :---------------- | :------------------------------------------------------------------------------------------- | :------------ |
| id                              | string            | The unique identifier for the custom field.                                                  |               |
| type                            | string            | The type of the custom field, which is "Custom".                                             |               |
| tagName                         | string            | The tag name for the custom field, which is "custom-field-prosjekt".                         |               |
| hideTitle                       | boolean           | A flag indicating whether the title should be hidden.                                        | false         |
| hideIfEmpty                     | boolean           | Determines whether the element should be hidden when it contains no content.                 | false         |
| inline                          | boolean           | A flag indicating whether the title and value should be displayed on the same line.          | false         |
| dataModelBindings.data          | string            | Reference to an [Prosjekt](../../classes/data-classes/Prosjekt.js) object in the data model. |               |
| resourceBindings.title          | string            | The title text resource binding.                                                             |               |
| resourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                        |               |
| styleOverride                   | HTMLElement.style | The style override for the custom field.                                                     |               |

## Example

```json
{
    "id": "metadata-prosjekt",
    "type": "Custom",
    "tagName": "custom-field-prosjekt",
    "hideTitle": true,
    "hideIfEmpty": false,
    "inline": false,
    "dataModelBindings": {
        "data": "metadata"
    },
    "resourceBindings": {
        "title": "resource.metadata.prosjektnavn",
        "emptyFieldText": "resource.emptyFieldText.default"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
