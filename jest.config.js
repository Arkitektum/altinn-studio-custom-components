module.exports = {
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    testPathIgnorePatterns: ["/node_modules/"],
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/setup-jest.js"],
    transform: {
        "^.+\\.[jt]sx?$": ["babel-jest", { "presets": ["@babel/preset-env"] }]
    },
    testMatch: [
        "<rootDir>/src/**/*.test.js",
        "<rootDir>/src/**/*.spec.js",
        "<rootDir>/public/**/*.test.js",
        "<rootDir>/public/**/*.spec.js"
    ]
};
