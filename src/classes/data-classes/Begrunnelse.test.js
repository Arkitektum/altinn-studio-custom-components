import Begrunnelse from "./Begrunnelse";
import Fordeler from "./Fordeler";
import Ulemper from "./Ulemper";

jest.mock("./Fordeler");
jest.mock("./Ulemper");

describe("Begrunnelse", () => {
    it("should initialize with default values when no props are provided", () => {
        const begrunnelse = new Begrunnelse();

        expect(begrunnelse.hensynBakBestemmelsen).toBeUndefined();
        expect(begrunnelse.vurderingHensynBakBestemmelsen).toBeUndefined();
        expect(begrunnelse.vurderingHensynOverordnet).toBeUndefined();
        expect(begrunnelse.fordeler).toBeUndefined();
        expect(begrunnelse.ulemper).toBeUndefined();
        expect(begrunnelse.samletBegrunnelse).toBeUndefined();
    });

    it("should initialize with provided props", () => {
        const props = {
            hensynBakBestemmelsen: "Some consideration",
            vurderingHensynBakBestemmelsen: "Some assessment",
            vurderingHensynOverordnet: "Overarching assessment",
            fordeler: { key: "value" },
            ulemper: { key: "value" },
            samletBegrunnelse: "Overall justification"
        };

        const begrunnelse = new Begrunnelse(props);

        expect(begrunnelse.hensynBakBestemmelsen).toBe(props.hensynBakBestemmelsen);
        expect(begrunnelse.vurderingHensynBakBestemmelsen).toBe(props.vurderingHensynBakBestemmelsen);
        expect(begrunnelse.vurderingHensynOverordnet).toBe(props.vurderingHensynOverordnet);
        expect(Fordeler).toHaveBeenCalledWith(props.fordeler);
        expect(Ulemper).toHaveBeenCalledWith(props.ulemper);
        expect(begrunnelse.samletBegrunnelse).toBe(props.samletBegrunnelse);
    });

    it("should not create Fordeler or Ulemper instances if props are not provided", () => {
        const props = {
            hensynBakBestemmelsen: "Some consideration",
            vurderingHensynBakBestemmelsen: "Some assessment",
            vurderingHensynOverordnet: "Overarching assessment",
            samletBegrunnelse: "Overall justification"
        };

        const begrunnelse = new Begrunnelse(props);

        expect(begrunnelse.fordeler).toBeUndefined();
        expect(begrunnelse.ulemper).toBeUndefined();
    });
});
