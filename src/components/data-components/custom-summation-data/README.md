# Data (summation)

| Property                        | Type    | Description                                                                  | Default value |
| :------------------------------ | :------ | :--------------------------------------------------------------------------- | :------------ |
| id                              | string  | The unique identifier for the custom field.                                  |               |
| type                            | string  | The type of the custom field, which is "Custom".                             |               |
| tagName                         | string  | The tag name for the custom field, which is "custom-summation-data".         |               |
| hideTitle                       | boolean | A flag indicating whether the title should be hidden.                        | false         |
| hideIfEmpty                     | boolean | Determines whether the element should be hidden when it contains no content. | false         |
| dataModelBindings.data          | string  | The data model binding for the summation data value.                         |               |
| resourceBindings.title          | string  | The resource binding for the title of the field.                             |               |
| resourceBindings.emptyFieldText | string  | The resource binding for the text to display when the field is empty.        |               |

## Example

```json
{
    "id": "summation-data",
    "type": "Custom",
    "tagName": "custom-summation-data",
    "dataModelBindings": {
        "data": "summationData"
    },
    "resourceBindings": {
        "title": "resource.summationData.title",
        "emptyFieldText": "resource.arealdisponering.emptyFieldText"
    }
}
```
