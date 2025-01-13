# Boolean text (field)

| Property                         | Type              | Description                                                                  | Default value |
| :------------------------------- | :---------------- | :--------------------------------------------------------------------------- | :------------ |
| id                               | string            | The unique identifier for the custom field.                                  |               |
| type                             | string            | The type of the custom field, which is "Custom".                             |               |
| tagName                          | string            | The tag name for the custom field, which is "custom-field-boolean-text".     |               |
| hideTitle                        | boolean           | A flag indicating whether the title should be hidden.                        | false         |
| hideIfEmpty                      | boolean           | Determines whether the element should be hidden when it contains no content. | false         |
| dataModelBindings.simpleBinding  | boolean           | Reference to a boolean value in the data model.                              |               |
| textResourceBindings.title       | string            | The title text resource binding.                                             |               |
| textResourceBindings.trueText    | string            | The text resource binding to display when the value is true.                 |               |
| textResourceBindings.falseText   | string            | The text resource binding to display when the value is false.                |               |
| textResourceBindings.defaultText | string            | The text resource binding to display when no value is set.                   |               |
| styleOverride                    | HTMLElement.style | The style override for the custom field.                                     |               |

## Example

```json
{
    "id": "soeknadGjelder-gjelderHeleTiltaket",
    "type": "Custom",
    "tagName": "custom-field-boolean-text",
    "hideTitle": true,
    "hideIfEmpty": false,
    "dataModelBindings": {
        "simpleBinding": "soeknadGjelder.gjelderHeleTiltaket"
    },
    "textResourceBindings": {
        "title": "resource.eiendomByggested.eiendom.bygningsnummer.title",
        "trueText": "resource.soeknadGjelder.gjelderHeleTiltaket.true.title",
        "falseText": "resource.soeknadGjelder.gjelderHeleTiltaket.false.title",
        "defaultText": "resource.soeknadGjelder.gjelderHeleTiltaket.default.title"
    }
},
```
