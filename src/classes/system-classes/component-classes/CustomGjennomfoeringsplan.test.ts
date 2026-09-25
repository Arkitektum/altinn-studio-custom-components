import type { ComponentProps, ResourceBindingGroup } from "../../../types.ts";

import { getTextResources, hasValue } from "@arkitektum/altinn-studio-custom-components-utils";
import { hasMissingTextResources, hasValidationMessages } from "../../../functions/validations.ts";
import CustomGjennomfoeringsplan from "./CustomGjennomfoeringsplan.ts";
import Gjennomfoeringsplan from "../../layout-classes/Gjennomfoeringsplan.ts";
import { getComponentResourceValue } from "../../../functions/helpers.ts";

jest.mock("../../layout-classes/Gjennomfoeringsplan");
jest.mock("../CustomComponent", () => {
    const { hasValue } = require("@arkitektum/altinn-studio-custom-components-utils");
    const { hasMissingTextResources } = require("../../../functions/validations.ts");
    return class {
        hasContent(data: unknown) {
            return hasValue(data);
        }
        getValidationMessages(resourceBindings: unknown) {
            return hasMissingTextResources(resourceBindings);
        }
    };
});
jest.mock("../../../functions/helpers");
jest.mock("../../../functions/validations");
jest.mock("@arkitektum/altinn-studio-custom-components-utils");

describe("CustomGjennomfoeringsplan", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockFormData = { some: "data" };
    const mockResourceBindings = {
        tiltaksklasse: { title: "custom.title", emptyFieldText: "custom.empty" }
    };

    (getComponentResourceValue as unknown as jest.Mock).mockReturnValue("EMPTY_FIELD_TEXT");
    (getTextResources as unknown as jest.Mock).mockReturnValue({ resource: "value" });
    (hasValue as unknown as jest.Mock).mockImplementation((data) => !!data);
    (hasMissingTextResources as unknown as jest.Mock).mockReturnValue({ missing: false });
    (hasValidationMessages as unknown as jest.Mock).mockReturnValue(false);
    (Gjennomfoeringsplan as unknown as jest.Mock).mockImplementation((...args: unknown[]) => ({
        ...(args[0] as object),
        isGjennomfoeringsplan: true
    }));

    it("should initialize with non-empty data", () => {
        const props = { formData: mockFormData } as unknown as ComponentProps;
        const instance = new CustomGjennomfoeringsplan(props);

        expect(instance.isEmpty).toBe(false);
        expect(instance.resourceValues.data).toEqual({ ...mockFormData, isGjennomfoeringsplan: true });
        expect(instance.resourceBindings.gjennomfoeringsplan!.title).toBe("resource.gjennomfoeringsplan.title");
        expect(instance.hasValidationMessages).toBe(false);
        expect(instance.validationMessages).toEqual({ missing: false });
    });

    it("should initialize with empty data", () => {
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        const props = { formData: null };
        const instance = new CustomGjennomfoeringsplan(props as unknown as ComponentProps);

        expect(instance.isEmpty).toBe(true);
        expect(getComponentResourceValue).toHaveBeenCalledWith(props as unknown as ComponentProps, "emptyFieldText");
        expect(instance.resourceValues.data).toBe("EMPTY_FIELD_TEXT");
    });

    it("should apply resourceBindings overrides", () => {
        const props = { formData: mockFormData, resourceBindings: mockResourceBindings };
        const instance = new CustomGjennomfoeringsplan(props);

        expect(instance.resourceBindings.tiltaksklasse!.title).toBe("custom.title");
        expect(instance.resourceBindings.tiltaksklasse!.emptyFieldText).toBe("custom.empty");
        expect(instance.resourceBindings.ansvarsomraade!.emptyFieldText).toBe("resource.emptyFieldText.default");
    });

    it("hasContent should delegate to hasValue", () => {
        const instance = new CustomGjennomfoeringsplan({ formData: mockFormData });
        (hasValue as unknown as jest.Mock).mockReturnValue(true);
        expect(instance.hasContent("abc")).toBe(true);
        (hasValue as unknown as jest.Mock).mockReturnValue(false);
        expect(instance.hasContent("")).toBe(false);
    });

    it("getValueFromFormData should return Gjennomfoeringsplan instance", () => {
        const instance = new CustomGjennomfoeringsplan({ formData: mockFormData });
        const result = instance.getValueFromFormData({ formData: mockFormData });
        expect(result).toEqual({ ...mockFormData, isGjennomfoeringsplan: true });
        expect(Gjennomfoeringsplan).toHaveBeenCalledWith(mockFormData);
    });

    it("getValidationMessages should call hasMissingTextResources", () => {
        const instance = new CustomGjennomfoeringsplan({ formData: mockFormData });
        const bindings = { foo: "bar" } as unknown as Record<string, ResourceBindingGroup>;
        instance.getValidationMessages(bindings);
        expect(hasMissingTextResources).toHaveBeenCalledWith(bindings);
    });

    it("getResourceBindings should return default and overridden bindings", () => {
        const instance = new CustomGjennomfoeringsplan({ resourceBindings: mockResourceBindings });
        const bindings = instance.getResourceBindings({ resourceBindings: mockResourceBindings });
        expect(bindings.tiltaksklasse.title).toBe("custom.title");
        expect(bindings.tiltaksklasse.emptyFieldText).toBe("custom.empty");
        expect(bindings.ansvarsfordeling.title).toBe("resource.ansvarsfordeling.title");
    });
});
