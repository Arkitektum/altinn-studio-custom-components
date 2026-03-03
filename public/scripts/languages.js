export const languages = [
    { code: "nb", name: "Norwegian Bokmål" },
    { code: "nn", name: "Norwegian Nynorsk" },
    { code: "en", name: "English" }
];

export function getLanguageNameFromCode(code) {
    return languages.find((lang) => lang.code === code)?.name || code;
}
