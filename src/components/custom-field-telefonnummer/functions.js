/**
 * Formats phone numbers by combining the provided phone number and mobile number into a single string.
 * Each number is placed on a new line.
 *
 * @param {Object} telefonnumre - An object containing phone numbers.
 * @param {string} telefonnumre.telefonnummer - The phone number.
 * @param {string} telefonnumre.mobilnummer - The mobile number.
 * @returns {string} A formatted string with each phone number on a new line.
 */
export function formatPhoneNumbers(telefonnumre) {
    const phoneNumbers = [telefonnumre.telefonnummer, telefonnumre.mobilnummer];
    return phoneNumbers.filter((nummerLinje) => nummerLinje?.length).join("\n");
}
