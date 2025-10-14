export default {
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',

    '^@/(.*)$': '<rootDir>/src/$1',

    '\\.(svg|png|jpg|jpeg|gif)$': '<rootDir>/__mocks__/fileMock.js',
  },

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },

  transformIgnorePatterns: ['node_modules/(?!(react-router-dom)/)'],

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  roots: ['<rootDir>/src'],
}
