import CustomField from './CustomField';
import { hasValue } from '../../../functions/helpers.js';

// Mock hasValue to control its behavior
jest.mock('../../../functions/helpers.js', () => ({
    hasValue: jest.fn(),
}));


describe('CustomField.hasContent', () => {
    let customField;

    beforeEach(() => {
        customField = new CustomField({});
    });

    it('returns true when hasValue returns true for resourceValues.data', () => {
        hasValue.mockReturnValue(true);
        const props = { resourceValues: { data: 'some value' } };
        expect(customField.hasContent(props)).toBe(true);
        expect(hasValue).toHaveBeenCalledWith('some value');
    });

    it('returns false when hasValue returns false for resourceValues.data', () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: { data: '' } };
        expect(customField.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith('');
    });

    it('returns false when resourceValues is undefined', () => {
        hasValue.mockReturnValue(false);
        const props = {};
        expect(customField.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it('returns false when props is undefined', () => {
        hasValue.mockReturnValue(false);
        expect(customField.hasContent(undefined)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(undefined);
    });

    it('returns false when resourceValues.data is null', () => {
        hasValue.mockReturnValue(false);
        const props = { resourceValues: { data: null } };
        expect(customField.hasContent(props)).toBe(false);
        expect(hasValue).toHaveBeenCalledWith(null);
    });
});