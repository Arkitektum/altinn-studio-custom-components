import UtfallSvar from "./UtfallSvar";
import Kode from "./Kode";
import UtfallType from "./UtfallType";
import Vedleggsliste from "./Vedleggsliste";

jest.mock("./Kode");
jest.mock("./UtfallType");
jest.mock("./Vedleggsliste");

describe("UtfallSvar", () => {
    it("should initialize with default values when no props are provided", () => {
        const instance = new UtfallSvar();
        expect(instance.beskrivelse).toBeUndefined();
        expect(instance.erUtfallBesvaresSenere).toBeUndefined();
        expect(instance.erUtfallBesvart).toBeUndefined();
        expect(instance.kommentar).toBeUndefined();
        expect(instance.tema).toBeUndefined();
        expect(instance.tittel).toBeUndefined();
        expect(instance.utfallType).toBeUndefined();
        expect(instance.vedleggsliste).toBeUndefined();
    });

    it("should initialize with provided props", () => {
        const props = {
            beskrivelse: "Test description",
            erUtfallBesvaresSenere: true,
            erUtfallBesvart: false,
            kommentar: "Test comment",
            tema: { code: "123" },
            tittel: "Test title",
            utfallType: { type: "TestType" },
            vedleggsliste: { attachments: ["file1", "file2"] }
        };

        const instance = new UtfallSvar(props);

        expect(instance.beskrivelse).toBe(props.beskrivelse);
        expect(instance.erUtfallBesvaresSenere).toBe(props.erUtfallBesvaresSenere);
        expect(instance.erUtfallBesvart).toBe(props.erUtfallBesvart);
        expect(instance.kommentar).toBe(props.kommentar);
        expect(Kode).toHaveBeenCalledWith(props.tema);
        expect(instance.tema).toBeInstanceOf(Kode);
        expect(instance.tittel).toBe(props.tittel);
        expect(UtfallType).toHaveBeenCalledWith(props.utfallType);
        expect(instance.utfallType).toBeInstanceOf(UtfallType);
        expect(Vedleggsliste).toHaveBeenCalledWith(props.vedleggsliste);
        expect(instance.vedleggsliste).toBeInstanceOf(Vedleggsliste);
    });

    it("should handle missing nested objects gracefully", () => {
        const props = {
            tema: null,
            utfallType: undefined,
            vedleggsliste: null
        };

        const instance = new UtfallSvar(props);

        expect(instance.tema).toBeUndefined();
        expect(instance.utfallType).toBeUndefined();
        expect(instance.vedleggsliste).toBeUndefined();
    });
});
