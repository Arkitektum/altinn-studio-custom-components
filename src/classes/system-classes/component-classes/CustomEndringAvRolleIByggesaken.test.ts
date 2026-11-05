import type { ComponentProps } from "../../../types.ts";

import CustomEndringAvRolleIByggesaken from "./CustomEndringAvRolleIByggesaken.ts";
import EndringAvRolleIByggesaken from "../../layout-classes/EndringAvRolleIByggesaken.ts";
import resources from "../../../data/resources.json";

describe("CustomEndringAvRolleIByggesaken", () => {
    const formData = {
        kommunensSaksnummer: { saksaar: 2024, sakssekvensnummer: 12345 },
        gjelderFraDato: "2026-12-12",
        rolleendringer: {
            rolleendring: [
                {
                    aktoer: { navn: "Kari Nordmann AS", organisasjonsnummer: "123456789" },
                    aktoertype: { kodeverdi: "AnsvarligSoeker", kodebeskrivelse: "Ansvarlig søker" },
                    aktoerendring: { kodeverdi: "ny", kodebeskrivelse: "Ny" },
                    erRolleendringErklaert: true
                }
            ]
        }
    };

    it("reads the form data into an EndringAvRolleIByggesaken", () => {
        const instance = new CustomEndringAvRolleIByggesaken({ formData });
        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toBeInstanceOf(EndringAvRolleIByggesaken);
        expect((instance.resourceValues.data as EndringAvRolleIByggesaken).gjelderFraDato).toBe("2026-12-12");
    });

    it("is empty when the form data holds nothing it reads", () => {
        const instance = new CustomEndringAvRolleIByggesaken({ formData: {} } as ComponentProps);
        expect(instance.isEmpty).toBe(true);
        expect(instance.resourceValues.data).not.toBeInstanceOf(EndringAvRolleIByggesaken);
    });

    it("has a default for every resource binding, each one defined in resources.json", () => {
        const instance = new CustomEndringAvRolleIByggesaken({ formData });
        expect(instance.resourceBindings.endringAvRolleIByggesaken?.title).toBe("resource.endringAvRolleIByggesaken.title");
        expect(instance.resourceBindings.rolleendringErRolleendringErklaert).toEqual({
            title: "resource.rolleendringer.rolleendring.erRolleendringErklaert.title",
            trueText: "resource.trueText.default",
            falseText: "resource.falseText.default"
        });
        const resourceIds = new Set(resources.map((resource) => resource.id));
        const defaultIds = Object.values(instance.resourceBindings).flatMap((group) => Object.values(group ?? {}));
        expect(defaultIds.filter((id) => !resourceIds.has(id as string))).toEqual([]);
    });

    it("lets a layout override a resource binding", () => {
        const instance = new CustomEndringAvRolleIByggesaken({
            formData,
            resourceBindings: { endringMeldtAv: { title: "custom.endringMeldtAv" } }
        } as ComponentProps);
        expect(instance.resourceBindings.endringMeldtAv?.title).toBe("custom.endringMeldtAv");
    });

    it("lists the components it renders", () => {
        const instance = new CustomEndringAvRolleIByggesaken({ formData });
        expect(instance.getComponentUsage()).toEqual(
            expect.arrayContaining(["custom-table-data", "custom-table-part", "custom-field-kommunens-saksnummer"])
        );
    });
});
