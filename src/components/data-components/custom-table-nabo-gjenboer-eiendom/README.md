# Eiendom (table)

| Property                        | Type    | Description                                                                       | Default value                             |
| :------------------------------ | :------ | :-------------------------------------------------------------------------------- | :---------------------------------------- |
| id                              | string  | The unique identifier for the custom field.                                       |                                           |
| type                            | string  | The type of the custom field, which is "Custom".                                  |                                           |
| tagName                         | string  | The tag name for the custom field, which is "custom-table-eiendom".               |                                           |
| hideTitle                       | boolean | A flag indicating whether the title should be hidden.                             | false                                     |
| hideIfEmpty                     | boolean | Determines whether the element should be hidden when it contains no content.      | false                                     |
| size                            | string  | The size of the header text (e.g., "h2", "h3", "h4").                             | "h2"                                      |
| dataModelBindings.data          | string  | Reference to an array or object in the data model containing values for the table |                                           |
| resourceBindings.title          | string  | The title text resource binding.                                                  | "resource.eiendomByggested.eiendom.title" |
| resourceBindings.emptyFieldText | string  | The resource binding for the text to display when the field is empty.             | "resource.emptyFieldText.default"         |

## Example

```json
{
    "id": "nabovarsel-referanse-pdf",
    "type": "Custom",
    "tagName": "custom-table-nabo-gjenboer-eiendom",
    "dataModelBindings": {
        "data": "naboGjenboer.eiendommer.eiendom"
    },
    "resourceBindings": {
        "title": "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.title",
        "emptyFieldText": "resource.naboGjenboer.eiendommer.eiendom.matrikkelinformasjon.emptyFieldText"
    }
}
```
