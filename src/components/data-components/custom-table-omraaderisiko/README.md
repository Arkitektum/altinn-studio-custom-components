# Områderisiko (table)

| Property                                         | Type    | Description                                                                            | Default value                                                                           |
| :----------------------------------------------- | :------ | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| id                                               | string  | The unique identifier for the custom field.                                            |                                                                                         |
| type                                             | string  | The type of the custom field, which is "Custom".                                       |                                                                                         |
| tagName                                          | string  | The tag name for the custom field, which is "custom-table-omraaderisiko".              |                                                                                         |
| hideTitle                                        | boolean | A flag indicating whether the title should be hidden.                                  | false                                                                                   |
| hideIfEmpty                                      | boolean | Determines whether the element should be hidden when it contains no content.           | false                                                                                   |
| size                                             | string  | The size of the header text (e.g., "h2", "h3", "h4").                                  | "h2"                                                                                    |
| dataModelBindings.data                           | string  | Reference to an array or object in the data model containing values for the table      |                                                                                         |
| resourceBindings.title                           | string  | The title text resource binding.                                                       | "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.title"                  |
| resourceBindings.emptyFieldText                  | string  | The resource binding for the text to display when the field is empty.                  | "resource.emptyFieldText.default"                                                       |
| resourceBindings.risikotype.title                | string  | The resource binding for the title of the risk type field.                             | "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.risikotype.title"       |
| resourceBindings.risikotype.emptyFieldText       | string  | The resource binding for the text to display when the risk type field is empty.        | "resource.emptyFieldText.default"                                                       |
| resourceBindings.sikkerhetsklasse.title          | string  | The resource binding for the title of the sikkerhetsklasse field.                      | "resource.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko.sikkerhetsklasse.title" |
| resourceBindings.sikkerhetsklasse.emptyFieldText | string  | The resource binding for the text to display when the sikkerhetsklasse field is empty. | "resource.emptyFieldText.default"                                                       |

## Example

```json
{
    "id": "rammebetingelser-kravTilByggegrunn-muligeOmraadeRisikoer-omraadeRisiko",
    "type": "Custom",
    "tagName": "custom-table-omraaderisiko",
    "hideIfEmpty": true,
    "hideTitle": true,
    "dataModelBindings": {
        "data": "rammebetingelser.kravTilByggegrunn.muligeOmraadeRisikoer.omraadeRisiko"
    }
}
```
