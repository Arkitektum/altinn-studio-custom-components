module.exports = {
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    testPathIgnorePatterns: ["/node_modules/"],
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/setup-jest.js"],
    transform: {
        "^.+\\.[jt]sx?$": ["babel-jest", { "presets": ["@babel/preset-env", "@babel/preset-typescript"] }]
    },
    testMatch: [
        "<rootDir>/src/**/*.test.{js,ts}",
        "<rootDir>/src/**/*.spec.{js,ts}",
        "<rootDir>/public/**/*.test.{js,ts}",
        "<rootDir>/public/**/*.spec.{js,ts}"
    ]
};
