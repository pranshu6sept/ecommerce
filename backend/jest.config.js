export default {
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'node',
    extensionsToTreatAsEsm: [], // Remove '.js' from here
};