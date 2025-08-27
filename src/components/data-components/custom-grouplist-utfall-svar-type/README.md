# Utfall svar (Group list)

| Property                        | Type    | Description                                                                                                        | Default value |
| :------------------------------ | :------ | :----------------------------------------------------------------------------------------------------------------- | :------------ |
| id                              | string  | The unique identifier for the custom field.                                                                        |               |
| type                            | string  | The type of the custom field, which is "Custom".                                                                   |               |
| tagName                         | string  | The tag name for the custom field, which is "custom-grouplist-utfall-svar-type".                                   |               |
| dataModelBindings.data          | string  | Reference to an array in the data model containing [UtfallSvar](../../classes/data-classes/UtfallSvar.js) objects. |               |
| hideTitle                       | boolean | A flag indicating whether the title should be hidden.                                                              | false         |
| enableLinks                     | boolean | A flag indicating whether links should be generated from URLs in content.                                          | false         |
| resourceBindings.title          | string  | The title text resource binding.                                                                                   |               |
| resourceBindings.emptyFieldText | string  | The resource binding for the text to display when the field is empty.                                              |               |

## Example

```json
{
    "id": "utfallBesvarelse-utfallSvar",
    "type": "Custom",
    "tagName": "custom-grouplist-utfall-svar-type",
    "dataModelBindings": {
        "data": "utfallBesvarelse.utfallSvar"
    },
    "resourceBindings": {
        "title": "resource.utfallSvar.title",
        "emptyFieldText": "resource.emptyFieldText.default"
    }
}
```
