# Utfallbesvarelse (field)

| Property                                    | Type              | Description                                                                                                  | Default value |
| :------------------------------------------ | :---------------- | :----------------------------------------------------------------------------------------------------------- | :------------ |
| id                                          | string            | The unique identifier for the custom field.                                                                  |               |
| type                                        | string            | The type of the custom field, which is "Custom".                                                             |               |
| tagName                                     | string            | The tag name for the custom field, which is "custom-field-utfall-svar-status".                               |               |
| hideTitle                                   | boolean           | A flag indicating whether the title should be hidden.                                                        | false         |
| hideIfEmpty                                 | boolean           | Determines whether the element should be hidden when it contains no content.                                 | false         |
| inline                                      | boolean           | A flag indicating whether the title and value should be displayed on the same line.                          | false         |
| dataModelBindings.data                      | string            | Reference to an [UtfallSvarStatus](../../classes/data-classes/UtfallSvarStatus.js) object in the data model. |               |
| textResourceBindings.title                  | string            | The title text resource binding.                                                                             |               |
| textResourceBindings.erUtfallBesvaresSenere | string            | The text resource binding for whether the outcome will be answered later.                                    |               |
| textResourceBindings.erUtfallBesvart        | string            | The text resource binding for whether the outcome has been answered.                                         |               |
| textResourceBindings.status                 | string            | The text resource binding for the status of the outcome.                                                     |               |
| styleOverride                               | HTMLElement.style | The style override for the custom field.                                                                     |               |

## Example

```json
{
    "id": "utfallBesvarelse-utfallSvar-status",
    "type": "Custom",
    "tagName": "custom-field-utfall-svar-status",
    "hideTitle": true,
    "hideIfEmpty": false,
    "inline": false,
    "dataModelBindings": {
        "data": "utfallBesvarelse.utfallSvar"
    },
    "textResourceBindings": {
        "title": "resource.utfallSvar.status",
        "erUtfallBesvaresSenere": "resource.utfallBesvarelse.utfallSvar.erUtfallBesvaresSenere",
        "erUtfallBesvart": "resource.utfallBesvarelse.utfallSvar.erUtfallBesvart",
        "status": "resource.utfallBesvarelse.utfallSvar.status"
    },
    "styleOverride": {
        "width": "120px"
    }
}
```
