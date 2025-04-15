import { getStatusText } from "./functions";
import { getComponentTexts, validateTexts } from "../../../functions/helpers.js";

jest.mock("../../../functions/helpers.js");

describe("getStatusText", () => {
    let component;

    beforeEach(() => {
        component = document.createElement("div");
        component.setAttribute("id", "test-component");
        jest.clearAllMocks();
    });

    it("should return 'Besvares senere' when erUtfallBesvaresSenere is true", async () => {
        const utfallSvarStatus = { erUtfallBesvaresSenere: true };
        getComponentTexts.mockResolvedValue({});
        validateTexts.mockImplementation(() => {});

        const result = await getStatusText(utfallSvarStatus, component);

        expect(result).toBe("Besvares senere");
        expect(getComponentTexts).toHaveBeenCalledWith(component);
        expect(validateTexts).toHaveBeenCalled();
    });

    it("should return 'Svar innsendt tidligere' when erUtfallBesvart is true", async () => {
        const utfallSvarStatus = { erUtfallBesvart: true };
        getComponentTexts.mockResolvedValue({});
        validateTexts.mockImplementation(() => {});

        const result = await getStatusText(utfallSvarStatus, component);

        expect(result).toBe("Svar innsendt tidligere");
        expect(getComponentTexts).toHaveBeenCalledWith(component);
        expect(validateTexts).toHaveBeenCalled();
    });

    it("should return 'Besvares nå' when no specific status is provided", async () => {
        const utfallSvarStatus = {};
        getComponentTexts.mockResolvedValue({});
        validateTexts.mockImplementation(() => {});

        const result = await getStatusText(utfallSvarStatus, component);

        expect(result).toBe("Besvares nå");
        expect(getComponentTexts).toHaveBeenCalledWith(component);
        expect(validateTexts).toHaveBeenCalled();
    });

    it("should return custom text when provided in component texts", async () => {
        const utfallSvarStatus = { erUtfallBesvaresSenere: true };
        getComponentTexts.mockResolvedValue({ erUtfallBesvaresSenere: "Custom Besvares senere" });
        validateTexts.mockImplementation(() => {});

        const result = await getStatusText(utfallSvarStatus, component);

        expect(result).toBe("Custom Besvares senere");
        expect(getComponentTexts).toHaveBeenCalledWith(component);
        expect(validateTexts).toHaveBeenCalled();
    });

    it("should handle missing component texts gracefully", async () => {
        const utfallSvarStatus = { erUtfallBesvaresSenere: true };
        getComponentTexts.mockResolvedValue(null);
        validateTexts.mockImplementation(() => {});

        const result = await getStatusText(utfallSvarStatus, component);

        expect(result).toBe("Besvares senere");
        expect(getComponentTexts).toHaveBeenCalledWith(component);
        expect(validateTexts).toHaveBeenCalled();
    });
});
