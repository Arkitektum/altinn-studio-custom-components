import UtfallSvarStatus from "./UtfallSvarStatus";

describe("UtfallSvarStatus", () => {
    it("should create an instance with default values when no props are provided", () => {
        const instance = new UtfallSvarStatus();
        expect(instance.erUtfallBesvaresSenere).toBeUndefined();
        expect(instance.erUtfallBesvart).toBeUndefined();
    });

    it("should create an instance with provided props", () => {
        const props = {
            erUtfallBesvaresSenere: true,
            erUtfallBesvart: false
        };
        const instance = new UtfallSvarStatus(props);
        expect(instance.erUtfallBesvaresSenere).toBe(true);
        expect(instance.erUtfallBesvart).toBe(false);
    });

    it("should handle partial props correctly", () => {
        const props = {
            erUtfallBesvaresSenere: true
        };
        const instance = new UtfallSvarStatus(props);
        expect(instance.erUtfallBesvaresSenere).toBe(true);
        expect(instance.erUtfallBesvart).toBeUndefined();
    });
});
