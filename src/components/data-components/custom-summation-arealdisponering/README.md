# Arealdisponering (summation)

| Property                                                    | Type    | Description                                                                            | Default value                                                                  |
| :---------------------------------------------------------- | :------ | :------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| id                                                          | string  | The unique identifier for the custom field.                                            |                                                                                |
| type                                                        | string  | The type of the custom field, which is "Custom".                                       |                                                                                |
| tagName                                                     | string  | The tag name for the custom field, which is "custom-summation-arealdisponering".       |                                                                                |
| hideTitle                                                   | boolean | A flag indicating whether the title should be hidden.                                  | false                                                                          |
| hideIfEmpty                                                 | boolean | Determines whether the element should be hidden when it contains no content.           | false                                                                          |
| dataModelBindings.data                                      | string  | Reference to an object in the data model containing values for the summation component |                                                                                |
| resourceBindings.emptyFieldText                             | string  | The resource binding for the text to display when the field is empty.                  | "resource.emptyFieldText.default"                                              |
| resourceBindings.tomtearealet.title                         | string  | The resource binding key for the title of the "tomtearealet" section.                  | "resource.rammebetingelser.arealdisponering.tomtearealet.title"                |
| resourceBindings.bebyggelsen.title                          | string  | The resource binding key for the title of the "bebyggelsen" section.                   | "resource.rammebetingelser.arealdisponering.bebyggelsen.title"                 |
| resourceBindings.arealBebyggelseEksisterende.title          | string  | The resource binding key for the title of "areal bebyggelse (eksisterende)".           | "resource.rammebetingelser.arealdisponering.arealBebyggelseEksisterende.title" |
| resourceBindings.arealBebyggelseEksisterende.emptyFieldText | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.arealBebyggelseEksisterende.unit           | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.arealBebyggelseNytt.title                  | string  | The resource binding key for the title of "areal bebyggelse (nytt)".                   | "resource.rammebetingelser.arealdisponering.arealBebyggelseNytt.title"         |
| resourceBindings.arealBebyggelseNytt.emptyFieldText         | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.arealBebyggelseNytt.operator               | string  | The resource binding key for the operator label shown for the value.                   | "resource.operator.plus"                                                       |
| resourceBindings.arealBebyggelseNytt.unit                   | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.arealBebyggelseSomSkalRives.title          | string  | The resource binding key for the title of "areal bebyggelse som skal rives".           | "resource.rammebetingelser.arealdisponering.arealBebyggelseSomSkalRives.title" |
| resourceBindings.arealBebyggelseSomSkalRives.emptyFieldText | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.arealBebyggelseSomSkalRives.operator       | string  | The resource binding key for the operator label shown for the value.                   | "resource.operator.minus"                                                      |
| resourceBindings.arealBebyggelseSomSkalRives.unit           | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.arealSumByggesak.title                     | string  | The resource binding key for the title of "areal sum byggesak".                        | "resource.rammebetingelser.arealdisponering.arealSumByggesak.title"            |
| resourceBindings.arealSumByggesak.emptyFieldText            | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.arealSumByggesak.operator                  | string  | The resource binding key for the operator label shown for the value.                   | "resource.operator.equals"                                                     |
| resourceBindings.arealSumByggesak.unit                      | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.beregnetMaksByggeareal.title               | string  | The resource binding key for the title of "beregnet maks byggeareal".                  | "resource.rammebetingelser.arealdisponering.beregnetMaksByggeareal.title"      |
| resourceBindings.beregnetMaksByggeareal.emptyFieldText      | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.beregnetMaksByggeareal.unit                | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.parkeringsarealTerreng.title               | string  | The resource binding key for the title of "parkeringsareal terreng".                   | "resource.rammebetingelser.arealdisponering.arealSumByggesak.title"            |
| resourceBindings.parkeringsarealTerreng.emptyFieldText      | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.parkeringsarealTerreng.operator            | string  | The resource binding key for the operator label shown for the value.                   | "resource.operator.equals"                                                     |
| resourceBindings.parkeringsarealTerreng.unit                | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.tomtearealBeregnet.title                   | string  | The resource binding key for the title of "tomteareal beregnet".                       | "resource.rammebetingelser.arealdisponering.tomtearealBeregnet.title"          |
| resourceBindings.tomtearealBeregnet.emptyFieldText          | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.tomtearealBeregnet.operator                | string  | The resource binding key for the operator label shown for the value.                   | "resource.operator.equals"                                                     |
| resourceBindings.tomtearealBeregnet.unit                    | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.tomtearealByggeomraade.title               | string  | The resource binding key for the title of "tomteareal byggeområde".                    | "resource.rammebetingelser.arealdisponering.tomtearealByggeomraade.title"      |
| resourceBindings.tomtearealByggeomraade.emptyFieldText      | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.tomtearealByggeomraade.unit                | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |
| resourceBindings.tomtearealSomTrekkesFra.title              | string  | The resource binding key for the title of "tomteareal som trekkes fra".                | "resource.rammebetingelser.arealdisponering.tomtearealSomTrekkesFra.title"     |
| resourceBindings.tomtearealSomTrekkesFra.emptyFieldText     | string  | The resource binding key for placeholder text when the field has no value.             | "resource.emptyFieldText.default"                                              |
| resourceBindings.tomtearealSomTrekkesFra.operator           | string  | The resource binding key for the operator label shown for the value.                   | "resource.operator.equals"                                                     |
| resourceBindings.tomtearealSomTrekkesFra.unit               | string  | The resource binding key for the unit label shown for the value.                       | "resource.unit.meterSquared"                                                   |

## Example

```json
{
    "id": "arealdisponering",
    "type": "Custom",
    "tagName": "custom-summation-arealdisponering",
    "dataModelBindings": {
        "data": "arealdisponering"
    },
    "resourceBindings": {
        "emptyFieldText": "resource.arealdisponering.emptyFieldText"
    }
}
```
