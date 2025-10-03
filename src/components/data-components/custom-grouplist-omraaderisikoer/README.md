# Varsling (Group list)

| Property                        | Type    | Description                                                                                                    | Default value                     |
| :------------------------------ | :------ | :------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| id                              | string  | The unique identifier for the custom field.                                                                    |                                   |
| type                            | string  | The type of the custom field, which is "Custom".                                                               |                                   |
| tagName                         | string  | The tag name for the custom field, which is "custom-grouplist-varsling".                                       |                                   |
| hideIfEmpty                     | boolean | A flag indicating whether the group should be hidden if empty.                                                 | false                             |
| hideTitle                       | boolean | A flag indicating whether the title should be hidden.                                                          | false                             |
| enableLinks                     | boolean | A flag indicating whether links should be generated from URLs in content.                                      | false                             |
| dataModelBindings.data          | string  | Reference to an array in the data model containing [Varsling](../../classes/data-classes/Varsling.js) objects. |                                   |
| resourceBindings.title          | string  | The title text resource binding.                                                                               | "resource.varsling.title"         |
| resourceBindings.trueText       | string  | The text resource binding to display when the value is true.                                                   | "resource.trueText.default"       |
| resourceBindings.falseText      | string  | The text resource binding to display when the value is false.                                                  | "resource.falseText.default"      |
| resourceBindings.defaultText    | string  | The text resource binding to display when no value is set.                                                     | "resource.defaultText.default"    |
| resourceBindings.emptyFieldText | string  | The resource binding for the text to display when the field is empty.                                          | "resource.emptyFieldText.default" |

## Example

```json
{
    "id": "varsling",
    "type": "Custom",
    "tagName": "custom-grouplist-varsling",
    "hideIfEmpty": true,
    "hideTitle": true,
    "dataModelBindings": {
        "data": "varsling"
    }
}
```
