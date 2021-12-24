module.exports = {
    testEnvironment: "jsdom",
    collectCoverage: true,
    coverageDirectory: "./coverage",
    coverageThreshold: {
        global: {
            lines: 90,
            statements: 90,
        },
    },
};
