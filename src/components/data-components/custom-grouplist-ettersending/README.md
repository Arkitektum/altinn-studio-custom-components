# Ettersending (Group list)

| Property                        | Type    | Description                                                                                                            | Default value |
| :------------------------------ | :------ | :--------------------------------------------------------------------------------------------------------------------- | :------------ |
| id                              | string  | The unique identifier for the custom field.                                                                            |               |
| type                            | string  | The type of the custom field, which is "Custom".                                                                       |               |
| tagName                         | string  | The tag name for the custom field, which is "custom-grouplist-ettersending".                                           |               |
| hideTitle                       | boolean | A flag indicating whether the title should be hidden.                                                                  | false         |
| enableLinks                     | boolean | A flag indicating whether links should be generated from URLs in content.                                              | false         |
| dataModelBindings.data          | string  | Reference to an array in the data model containing [Ettersending](../../classes/data-classes/Ettersending.js) objects. |               |
| resourceBindings.title          | string  | The title text resource binding.                                                                                       |               |
| resourceBindings.emptyFieldText | string  | The resource binding for the text to display when the field is empty.                                                  |               |

## Example

```json
{
    "id": "ettersendinger",
    "type": "Custom",
    "tagName": "custom-grouplist-ettersending",
    "dataModelBindings": {
        "data": "ettersendinger.ettersending"
    },
    "resourceBindings": {
        "title": "resource.ettersendinger.title",
        "emptyFieldText": "resource.innledning"
    }
}
```
