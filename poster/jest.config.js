module.exports = {
  verbose: true,
  testEnvironment: 'jest-environment-node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  roots: ['lib'], // makes crawling tests a lot faster

  // typescript stuff
  transform: {
    // important to only transform ts or some js modules will break
    '\\.[jt]s$': 'ts-jest'
  },
  testRegex: '\\.test\\.[jt]s$',
  moduleFileExtensions: ['js', 'json', 'ts']
}
