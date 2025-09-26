# Sjekklistekrav (Group)

| Property                        | Type    | Description                                                                                                                 | Default value                     |
| :------------------------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------- | :-------------------------------- |
| id                              | string  | The unique identifier for the custom field.                                                                                 |                                   |
| type                            | string  | The type of the custom field, which is "Custom".                                                                            |                                   |
| tagName                         | string  | The tag name for the custom field, which is "custom-group-sjekklistekrav".                                                  |                                   |
| hideTitle                       | boolean | A flag indicating whether the title should be hidden.                                                                       | false                             |
| enableLinks                     | boolean | A flag indicating whether links should be generated from URLs in content.                                                   | false                             |
| dataModelBindings.data          | string  | Reference to an object in the data model containing [Sjekklistekrav](../../classes/data-classes/Sjekklistekrav.js) objects. |                                   |
| resourceBindings.trueText       | string  | The text resource binding to display when the value is true.                                                                | "resource.trueText.default"       |
| resourceBindings.falseText      | string  | The text resource binding to display when the value is false.                                                               | "resource.falseText.default"      |
| resourceBindings.defaultText    | string  | The text resource binding to display when no value is set.                                                                  | "resource.defaultText.default"    |
| resourceBindings.emptyFieldText | string  | The resource binding for the text to display when the field is empty.                                                       | "resource.emptyFieldText.default" |

## Example

```json
{
    "id": "sjekklistekrav",
    "type": "Custom",
    "tagName": "custom-group-sjekklistekrav",
    "hideTitle": true,
    "dataModelBindings": {
        "data": "krav.sjekklistekrav"
    }
}
```
