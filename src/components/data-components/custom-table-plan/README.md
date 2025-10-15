# Plan (table)

| Property                                 | Type    | Description                                                                                                                                                                   | Default value                                                                           |
| :--------------------------------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| id                                       | string  | The unique identifier for the custom field.                                                                                                                                   |                                                                                         |
| type                                     | string  | The type of the custom field, which is "Custom".                                                                                                                              |                                                                                         |
| tagName                                  | string  | The tag name for the custom field, which is "custom-table-plan".                                                                                                              |                                                                                         |
| hideTitle                                | boolean | A flag indicating whether the title should be hidden.                                                                                                                         | false                                                                                   |
| hideIfEmpty                              | boolean | Determines whether the element should be hidden when it contains no content.                                                                                                  | false                                                                                   |
| size                                     | string  | The size of the header text (e.g., "h2", "h3", "h4").                                                                                                                         | "h2"                                                                                    |
| dataModelBindings.data                   | string  | Reference to an array of type [AndrePlaner](../../../classes/data-classes/AndrePlaner.js) in the data model containing [Plan](../../../classes/data-classes/Plan.js) objects. |                                                                                         |
| resourceBindings.title                   | string  | The title text resource binding.                                                                                                                                              | "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.title"                  |
| resourceBindings.emptyFieldText          | string  | The resource binding for the text to display when the field is empty.                                                                                                         | "resource.emptyFieldText.default"                                                       |
| resourceBindings.navn.title              | string  | The resource binding for the title of the "navn" (risk type) column.                                                                                                          | "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.risikotype.title"       |
| resourceBindings.navn.emptyFieldText     | string  | The resource binding for the text to display when the "navn" field is empty.                                                                                                  | "resource.emptyFieldText.default"                                                       |
| resourceBindings.plantype.title          | string  | The resource binding for the title of the "plantype" (safety class) column.                                                                                                   | "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.sikkerhetsklasse.title" |
| resourceBindings.plantype.emptyFieldText | string  | The resource binding for the text to display when the "plantype" field is empty.                                                                                              | "resource.emptyFieldText.default"                                                       |

## Example

```json
{
    "id": "planer-andrePlaner-plan",
    "type": "Custom",
    "tagName": "custom-table-plan",
    "hideIfEmpty": true,
    "hideTitle": false,
    "dataModelBindings": {
        "data": "planer.andrePlaner.plan"
    }
}
```
