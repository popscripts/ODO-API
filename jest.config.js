module.exports = {
    preset: 'ts-jest',
    globalSetup: '<rootDir>/jest.setup.ts',
    globalTeardown: '<rootDir>/jest.teardown.ts',
    testEnvironment: 'node',
    testTimeout: 70000,
    moduleNameMapper: {
        '@config/(.*)': '<rootDir>/src/config/$1',
        '@controllers/(.*)': '<rootDir>/src/controllers/$1',
        '@handlers/(.*)': '<rootDir>/src/handlers/$1',
        '@libs/(.*)': '<rootDir>/src/libs/$1',
        '@middlewares/(.*)': '<rootDir>/src/middlewares/$1',
        '@routes/(.*)': '<rootDir>/src/routes/$1',
        '@services/(.*)': '<rootDir>/src/services/$1',
        '@customTypes/(.*)': '<rootDir>/src/customTypes/$1',
        '@utils/(.*)': '<rootDir>/src/utils/$1',
        '@validations/(.*)': '<rootDir>/src/validations/$1'
    }
}
