module.exports = {
    transform: {
        ".(ts|tsx)$": require.resolve("ts-jest/dist"),
        ".(js|jsx)$": require.resolve("babel-jest"),
    },
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}"],
    coverageThreshold: {
        global: {
            lines: 90,
            statements: 90,
        },
    },
};
