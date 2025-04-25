# Tiltakshaver (table)

| Property               | Type    | Description                                                                       | Default value |
| :--------------------- | :------ | :-------------------------------------------------------------------------------- | :------------ |
| id                     | string  | The unique identifier for the custom field.                                       |               |
| type                   | string  | The type of the custom field, which is "Custom".                                  |               |
| tagName                | string  | The tag name for the custom field, which is "custom-table-tiltakshaver".          |               |
| hideTitle              | boolean | A flag indicating whether the title should be hidden.                             | false         |
| hideIfEmpty            | boolean | Determines whether the element should be hidden when it contains no content.      | false         |
| size                   | string  | The size of the header text (e.g., "h2", "h3", "h4").                             | "h2"          |
| dataModelBindings.data | string  | Reference to an array or object in the data model containing values for the table |               |

## Example

```json
{
    "id": "tiltakshaver",
    "type": "Custom",
    "tagName": "custom-table-tiltakshaver",
    "size": "h2",
    "dataModelBindings": {
        "data": "tiltakshaver"
    }
}
```
