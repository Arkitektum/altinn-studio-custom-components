# Kommunens saksnummer (field)

| Property                   | Type              | Description                                                                                           | Default value |
| :------------------------- | :---------------- | :---------------------------------------------------------------------------------------------------- | :------------ |
| id                         | string            | The unique identifier for the custom field.                                                           |               |
| type                       | string            | The type of the custom field, which is "Custom".                                                      |               |
| tagName                    | string            | The tag name for the custom field, which is "custom-field-kommunens-saksnummer".                      |               |
| hideTitle                  | boolean           | A flag indicating whether the title should be hidden.                                                 | false         |
| hideIfEmpty                | boolean           | Determines whether the element should be hidden when it contains no content.                          | false         |
| emptyFieldText             | string            | The text to display when the field is empty.                                                          |               |
| dataModelBindings.data     | string            | Reference to an [KommunensSaksnummer](../../classes/KommunensSaksnummer.js) object in the data model. |               |
| textResourceBindings.title | string            | The title text resource binding.                                                                      |               |
| styleOverride              | HTMLElement.style | The style override for the custom field.                                                              |               |

## Example

```json
{
    "id": "kommunensSaksnummer",
    "type": "Custom",
    "tagName": "custom-field-kommunens-saksnummer",
    "hideTitle": true,
    "hideIfEmpty": false,
    "emptyFieldText": "-",
    "dataModelBindings": {
        "data": "kommunensSaksnummer"
    },
    "textResourceBindings": {
        "title": "resource.kommunensSaksnummer"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```