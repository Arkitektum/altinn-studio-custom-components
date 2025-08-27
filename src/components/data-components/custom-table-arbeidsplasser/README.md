# Part (table)

| Property                           | Type    | Description                                                                       | Default value                                     |
| :--------------------------------- | :------ | :-------------------------------------------------------------------------------- | :------------------------------------------------ |
| id                                 | string  | The unique identifier for the custom field.                                       |                                                   |
| type                               | string  | The type of the custom field, which is "Custom".                                  |                                                   |
| tagName                            | string  | The tag name for the custom field, which is "custom-table-arbeidsplasser".        |                                                   |
| hideTitle                          | boolean | A flag indicating whether the title should be hidden.                             | false                                             |
| hideIfEmpty                        | boolean | Determines whether the element should be hidden when it contains no content.      | false                                             |
| size                               | string  | The size of the header text (e.g., "h2", "h3", "h4").                             | "h2"                                              |
| dataModelBindings.data             | string  | Reference to an array or object in the data model containing values for the table |                                                   |
| resourceBindings.title             | string  | The title text resource binding.                                                  | "resource.arbeidsplasser.title"                   |
| resourceBindings.emptyFieldText    | string  | The resource binding for the text to display when the field is empty.             | "resource.emptyFieldText.default"                 |
| resourceBindings.arbeidsplasserKey | string  | The resource binding for the arbeidsplasser table header.                         | "resource.arbeidsplasser.arbeidsplasserKey.title" |
| resourceBindings.beroertAvTiltaket | string  | The resource binding for the 'berørt av tiltaket' table header.                   | "resource.arbeidsplasser.beroertAvTiltaket.title" |

## Example

```json
{
    "id": "arbeidsplasser",
    "type": "Custom",
    "tagName": "custom-table-arbeidsplasser",
    "size": "h2",
    "dataModelBindings": {
        "data": "arbeidsplasser"
    },
    "resourceBindings": {
        "title": "resource.arbeidsplasser.title",
        "emptyFieldText": "resource.tiltakshaver.emptyFieldText"
    }
}
```
