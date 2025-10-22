import CustomDispensasjonerUnitInList from "./CustomDispensasjonerUnitInList";
import CustomComponent from "../CustomComponent.js";
const { getComponentDataValue, hasValue } = require("../../../functions/helpers.js");
const { hasMissingTextResources, hasValidationMessages } = require("../../../functions/validations.js");

// Mock dependencies
jest.mock("../../../functions/helpers.js", () => ({
    getComponentDataValue: jest.fn(),
    hasValue: jest.fn()
}));
jest.mock("../../../functions/validations.js", () => ({
    hasMissingTextResources: jest.fn(),
    hasValidationMessages: jest.fn()
}));

describe("CustomDispensasjonerUnitInList", () => {
    let props;

    beforeEach(() => {
        props = {
            resourceBindings: {
                bestemmelse: { title: "Bestemmelse Title" },
                begrunnelse: { title: "Begrunnelse Title" },
                title: "Bestemmelsestype Title"
            },
            hideTitle: false,
            formData: { some: "data" }
        };
        getComponentDataValue.mockClear();
        hasValue.mockClear();
        hasMissingTextResources.mockClear();
        hasValidationMessages.mockClear();
    });

    it("should extend CustomComponent", () => {
        const instance = new CustomDispensasjonerUnitInList(props);
        expect(instance instanceof CustomComponent).toBe(true);
    });

    it("should set resourceBindings with all keys when hideTitle is false", () => {
        getComponentDataValue.mockReturnValue("dataValue");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(["msg"]);
        hasValidationMessages.mockReturnValue(true);

        const instance = new CustomDispensasjonerUnitInList(props);

        expect(instance.resourceBindings).toHaveProperty("bestemmelse");
        expect(instance.resourceBindings).toHaveProperty("begrunnelse");
        expect(instance.resourceBindings).toHaveProperty("bestemmelsestype");
        expect(instance.resourceBindings.bestemmelse.title).toBe("Bestemmelse Title");
        expect(instance.resourceBindings.begrunnelse.title).toBe("Begrunnelse Title");
        expect(instance.resourceBindings.bestemmelsestype.title).toBe("Bestemmelsestype Title");
    });

    it("should omit bestemmelsestype when hideTitle is true", () => {
        props.hideTitle = true;
        getComponentDataValue.mockReturnValue("dataValue");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomDispensasjonerUnitInList(props);

        expect(instance.resourceBindings).toHaveProperty("bestemmelse");
        expect(instance.resourceBindings).toHaveProperty("begrunnelse");
        expect(instance.resourceBindings).not.toHaveProperty("bestemmelsestype");
    });

    it("should use default resource titles if not provided", () => {
        props.resourceBindings = {};
        getComponentDataValue.mockReturnValue("dataValue");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomDispensasjonerUnitInList(props);

        expect(instance.resourceBindings.bestemmelse.title).toBe("resource.dispensasjon.bestemmelse.title");
        expect(instance.resourceBindings.begrunnelse.title).toBe("resource.dispensasjon.begrunnelse.title");
        expect(instance.resourceBindings.bestemmelsestype.title).toBe("resource.bestemmelsestype.header");
    });

    it("should set isEmpty based on hasContent", () => {
        getComponentDataValue.mockReturnValue("dataValue");
        hasValue.mockReturnValue(false);
        hasMissingTextResources.mockReturnValue([]);
        hasValidationMessages.mockReturnValue(false);

        const instance = new CustomDispensasjonerUnitInList(props);

        expect(instance.isEmpty).toBe(true);
    });

    it("should set validationMessages and hasValidationMessages", () => {
        getComponentDataValue.mockReturnValue("dataValue");
        hasValue.mockReturnValue(true);
        hasMissingTextResources.mockReturnValue(["missing"]);
        hasValidationMessages.mockReturnValue(true);

        const instance = new CustomDispensasjonerUnitInList(props);

        expect(instance.validationMessages).toEqual(["missing"]);
        expect(instance.hasValidationMessages).toBe(true);
    });

    describe("hasContent", () => {
        it("should call hasValue", () => {
            hasValue.mockReturnValue(true);
            const instance = new CustomDispensasjonerUnitInList(props);
            instance.hasContent("abc");
            expect(hasValue).toHaveBeenCalledWith("abc");
        });
    });

    describe("getValueFromFormData", () => {
        it("should call getComponentDataValue", () => {
            getComponentDataValue.mockReturnValue("val");
            const instance = new CustomDispensasjonerUnitInList(props);
            expect(instance.getValueFromFormData(props)).toBe("val");
            expect(getComponentDataValue).toHaveBeenCalledWith(props);
        });
    });

    describe("getValidationMessages", () => {
        it("should call hasMissingTextResources with window.textResources", () => {
            const textResources = [{ id: "1", value: "abc" }];
            global.window = Object.create(window);
            window.textResources = textResources;
            hasMissingTextResources.mockReturnValue(["msg"]);
            const instance = new CustomDispensasjonerUnitInList(props);
            expect(instance.getValidationMessages({})).toEqual(["msg"]);
            expect(hasMissingTextResources).toHaveBeenCalledWith(textResources, {});
            delete global.window;
        });

        it("should call hasMissingTextResources with empty array if window.textResources is undefined", () => {
            global.window = {};
            hasMissingTextResources.mockReturnValue([]);
            const instance = new CustomDispensasjonerUnitInList(props);
            expect(instance.getValidationMessages({})).toEqual([]);
            expect(hasMissingTextResources).toHaveBeenCalledWith([], {});
            delete global.window;
        });
    });

    describe("getResourceBindings", () => {
        it('should return correct bindings when hideTitle is "true" string', () => {
            props.hideTitle = "true";
            props.resourceBindings = {};
            const instance = new CustomDispensasjonerUnitInList(props);
            const bindings = instance.getResourceBindings(props);
            expect(bindings).not.toHaveProperty("bestemmelsestype");
        });
    });
});
