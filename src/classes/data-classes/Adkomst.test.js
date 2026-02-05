import Adkomst from './Adkomst.js';
import Vegtype from './Vegtype.js';

// Mock Vegtype class
jest.mock('./Vegtype.js', () => {
    return jest.fn().mockImplementation((arg) => {
        return { mocked: true, arg };
    });
});

describe('Adkomst', () => {
    beforeEach(() => {
        Vegtype.mockClear();
    });

    it('should set erNyEllerEndretAdkomst from props', () => {
        const adkomst = new Adkomst({ erNyEllerEndretAdkomst: true });
        expect(adkomst.erNyEllerEndretAdkomst).toBe(true);
    });

    it('should instantiate Vegtype with props.vegtype if provided', () => {
        const vegtypeData = [{ kode: '1' }, { kode: '2' }];
        const adkomst = new Adkomst({ vegtype: vegtypeData });
        expect(Vegtype).toHaveBeenCalledTimes(1);
        expect(Vegtype).toHaveBeenCalledWith(vegtypeData);
        expect(adkomst.vegtype).toEqual({ mocked: true, arg: vegtypeData });
    });

    it('should not instantiate Vegtype if props.vegtype is undefined', () => {
        const adkomst = new Adkomst({});
        expect(Vegtype).not.toHaveBeenCalled();
        expect(adkomst.vegtype).toBeFalsy();
    });

    it('should handle missing props gracefully', () => {
        const adkomst = new Adkomst();
        expect(adkomst.erNyEllerEndretAdkomst).toBeUndefined();
        expect(adkomst.vegtype).toBeFalsy();
    });
});