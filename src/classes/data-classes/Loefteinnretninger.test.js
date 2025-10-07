import Loefteinnretninger from "./Loefteinnretninger";

describe("Loefteinnretninger", () => {
    it("should initialize all properties from props", () => {
        const props = {
            erLoefteinnretningIBygning: true,
            planleggesLoefteinnretningIBygning: false,
            planleggesHeis: true,
            planleggesTrappeheis: false,
            planleggesRulletrapp: true,
            planleggesLoefteplattform: false
        };
        const instance = new Loefteinnretninger(props);

        expect(instance.erLoefteinnretningIBygning).toBe(true);
        expect(instance.planleggesLoefteinnretningIBygning).toBe(false);
        expect(instance.planleggesHeis).toBe(true);
        expect(instance.planleggesTrappeheis).toBe(false);
        expect(instance.planleggesRulletrapp).toBe(true);
        expect(instance.planleggesLoefteplattform).toBe(false);
    });

    it("should set properties to undefined if not provided", () => {
        const instance = new Loefteinnretninger({});
        expect(instance.erLoefteinnretningIBygning).toBeUndefined();
        expect(instance.planleggesLoefteinnretningIBygning).toBeUndefined();
        expect(instance.planleggesHeis).toBeUndefined();
        expect(instance.planleggesTrappeheis).toBeUndefined();
        expect(instance.planleggesRulletrapp).toBeUndefined();
        expect(instance.planleggesLoefteplattform).toBeUndefined();
    });

    it("should handle missing props argument", () => {
        const instance = new Loefteinnretninger();
        expect(instance.erLoefteinnretningIBygning).toBeUndefined();
        expect(instance.planleggesLoefteinnretningIBygning).toBeUndefined();
        expect(instance.planleggesHeis).toBeUndefined();
        expect(instance.planleggesTrappeheis).toBeUndefined();
        expect(instance.planleggesRulletrapp).toBeUndefined();
        expect(instance.planleggesLoefteplattform).toBeUndefined();
    });
});
