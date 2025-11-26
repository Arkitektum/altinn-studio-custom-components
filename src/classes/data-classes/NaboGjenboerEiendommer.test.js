import NaboGjenboerEiendommer from "./NaboGjenboerEiendommer";
import NaboGjenboerEiendom from "./NaboGjenboerEiendom";

jest.mock("./NaboGjenboerEiendom");

describe("NaboGjenboerEiendommer", () => {
    beforeEach(() => {
        NaboGjenboerEiendom.mockClear();
    });

    it("should initialize naboGjenboerEiendom as undefined if no props are given", () => {
        const instance = new NaboGjenboerEiendommer();
        expect(instance.naboGjenboerEiendom).toBeUndefined();
    });

    it("should initialize naboGjenboerEiendom as undefined if props is empty object", () => {
        const instance = new NaboGjenboerEiendommer({});
        expect(instance.naboGjenboerEiendom).toBeUndefined();
    });

    it("should map each item in props.naboGjenboerEiendom to a NaboGjenboerEiendom instance", () => {
        const items = [{ id: 1 }, { id: 2 }];
        const instance = new NaboGjenboerEiendommer({ naboGjenboerEiendom: items });

        expect(NaboGjenboerEiendom).toHaveBeenCalledTimes(2);
        expect(NaboGjenboerEiendom).toHaveBeenNthCalledWith(1, items[0]);
        expect(NaboGjenboerEiendom).toHaveBeenNthCalledWith(2, items[1]);
        expect(instance.naboGjenboerEiendom).toHaveLength(2);
        expect(instance.naboGjenboerEiendom[0]).toBeInstanceOf(NaboGjenboerEiendom);
        expect(instance.naboGjenboerEiendom[1]).toBeInstanceOf(NaboGjenboerEiendom);
    });

    it("should handle empty array for naboGjenboerEiendom", () => {
        const instance = new NaboGjenboerEiendommer({ naboGjenboerEiendom: [] });
        expect(instance.naboGjenboerEiendom).toEqual([]);
        expect(NaboGjenboerEiendom).not.toHaveBeenCalled();
    });
});
