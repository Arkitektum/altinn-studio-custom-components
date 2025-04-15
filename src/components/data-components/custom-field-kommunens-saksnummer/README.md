# Kommunens saksnummer (field)

| Property                            | Type              | Description                                                                                                        | Default value |
| :---------------------------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------- | :------------ |
| id                                  | string            | The unique identifier for the custom field.                                                                        |               |
| type                                | string            | The type of the custom field, which is "Custom".                                                                   |               |
| tagName                             | string            | The tag name for the custom field, which is "custom-field-kommunens-saksnummer".                                   |               |
| hideTitle                           | boolean           | A flag indicating whether the title should be hidden.                                                              | false         |
| hideIfEmpty                         | boolean           | Determines whether the element should be hidden when it contains no content.                                       | false         |
| inline                              | boolean           | A flag indicating whether the title and value should be displayed on the same line.                                | false         |
| dataModelBindings.data              | string            | Reference to an [KommunensSaksnummer](../../classes/data-classes/KommunensSaksnummer.js) object in the data model. |               |
| textResourceBindings.title          | string            | The title text resource binding.                                                                                   |               |
| textResourceBindings.emptyFieldText | string            | The resource binding for the text to display when the field is empty.                                              |               |
| styleOverride                       | HTMLElement.style | The style override for the custom field.                                                                           |               |

## Example

```json
{
    "id": "kommunensSaksnummer",
    "type": "Custom",
    "tagName": "custom-field-kommunens-saksnummer",
    "hideTitle": true,
    "hideIfEmpty": false,
    "inline": false,
    "dataModelBindings": {
        "data": "kommunensSaksnummer"
    },
    "textResourceBindings": {
        "title": "resource.kommunensSaksnummer",
        "emptyFieldText": "resource.emptyFieldText.default"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
