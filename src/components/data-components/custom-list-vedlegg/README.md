# Vedlegg (list)

| Property                        | Type              | Description                                                                                                  | Default value |
| :------------------------------ | :---------------- | :----------------------------------------------------------------------------------------------------------- | :------------ |
| id                              | string            | The unique identifier for the custom field.                                                                  |               |
| type                            | string            | The type of the custom field, which is "Custom".                                                             |               |
| tagName                         | string            | The tag name for the custom field, which is "custom-list-vedlegg".                                           |               |
| hideTitle                       | boolean           | A flag indicating whether the title should be hidden.                                                        | false         |
| hideIfEmpty                     | boolean           | Determines whether the element should be hidden when it contains no content.                                 | false         |
| dataModelBindings.data          | string            | Reference to an array in the data model containing [Vedlegg](../../classes/data-classes/Vedlegg.js) objects. |               |
| resourceBindings.title          | string            | The title text resource binding.                                                                             |               |
| resourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                                        |               |
| styleOverride                   | HTMLElement.style | The style override for the custom field.                                                                     |               |

## Example

```json
{
    "id": "utfallBesvarelse-utfallSvar-vedlegg",
    "type": "Custom",
    "tagName": "custom-list-vedlegg",
    "hideTitle": true,
    "hideIfEmpty": false,
    "dataModelBindings": {
        "data": "utfallBesvarelse.utfallSvar.vedleggsliste.vedlegg"
    },
    "resourceBindings": {
        "title": "resource.utfallSvar.vedleggsliste.vedlegg",
        "emptyFieldText": "resource.emptyFieldText.default"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
