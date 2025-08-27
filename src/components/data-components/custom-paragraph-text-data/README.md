# Text (paragraph)

| Property                        | Type    | Description                                                                  | Default value |
| :------------------------------ | :------ | :--------------------------------------------------------------------------- | :------------ |
| id                              | string  | The unique identifier for the custom field.                                  |               |
| type                            | string  | The type of the custom field, which is "Custom".                             |               |
| tagName                         | string  | The tag name for the custom field, which is "custom-paragraph-text-data".    |               |
| endSymbol                       | string  | symbol to put at the end of concanated string, f.eks "." or ")"              |               |
| hideIfEmpty                     | boolean | Determines whether the element should be hidden when it contains no content. | false         |
| resourceBindings.title          | string  | The title text resource binding.                                             |               |
| resourceBindings.emptyFieldText | string  | The resource binding for the text to display when the field is empty.        |               |
| dataModelBindings.simpleBinding | string  | Reference to a string, number og boolean value in the data model.            |               |

## Example

```json
{
    "id": "soeknadGjelder-description",
    "type": "Custom",
    "tagName": "custom-paragraph-text-data",
    "endSymbol": ".",
    "dataModelBindings": {
        "simpleBinding": "soeknadGjelder.delsoeknadsnummer"
    },
    "resourceBindings": {
        "title": "resource.soeknadGjelder.description"
    }
}
```
