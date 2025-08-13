# Part (table)

| Property                             | Type    | Description                                                                       | Default value                             |
| :----------------------------------- | :------ | :-------------------------------------------------------------------------------- | :---------------------------------------- |
| id                                   | string  | The unique identifier for the custom field.                                       |                                           |
| type                                 | string  | The type of the custom field, which is "Custom".                                  |                                           |
| tagName                              | string  | The tag name for the custom field, which is "custom-table-part".                  |                                           |
| hideTitle                            | boolean | A flag indicating whether the title should be hidden.                             | false                                     |
| hideIfEmpty                          | boolean | Determines whether the element should be hidden when it contains no content.      | false                                     |
| size                                 | string  | The size of the header text (e.g., "h2", "h3", "h4").                             | "h2"                                      |
| partType                             | string  | The type of part represented in the table (e.g., "tiltakshaver.kontaktperson").   | "tiltakshaver"                            |
| dataModelBindings.data               | string  | Reference to an array or object in the data model containing values for the table |                                           |
| resourceBindings.title               | string  | The title text resource binding.                                                  | "resource.`partType`.header"              |
| resourceBindings.navn.title          | string  | The resource binding for the name field in the table.                             | "resource.`partType`.navn.title"          |
| resourceBindings.telefonnummer.title | string  | The resource binding for the phone number field in the table.                     | "resource.`partType`.telefonnummer.title" |
| resourceBindings.epost.title         | string  | The resource binding for the email field in the table.                            | "resource.`partType`.epost.title"         |
| resourceBindings.emptyFieldText      | string  | The resource binding for the text to display when the field is empty.             | "resource.emptyFieldText.default"         |

## Example

```json
{
    "id": "tiltakshaver",
    "type": "Custom",
    "tagName": "custom-table-part",
    "size": "h2",
    "partType": "tiltakshaver.kontaktperson",
    "dataModelBindings": {
        "data": "tiltakshaver"
    },
    "resourceBindings": {
        "emptyFieldText": "resource.tiltakshaver.emptyFieldText"
    }
}
```
