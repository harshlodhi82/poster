module.exports = {
  "extends": "standard",
  "globals": {
    "arguments": "readonly"
  },
  "rules": {
    "no-var": "warn",
    "require-await": "error",
    "no-unmodified-loop-condition": "warn",
    "object-curly-spacing": ["error", "never"],
    "no-use-before-define": "off",
    "no-unused-vars": "warn",
    "brace-style": ["error", "stroustrup"],
    "no-unreachable": "warn",
    "camelcase": "off",
    "operator-linebreak": ["error", "before", {"overrides": {"=": "ignore"}}],
    "standard/no-callback-literal": "off"
  },
  // needed because of bug with typescript interfaces
  // typescript will catch no undef errors
  "overrides": {
    "files": ["**/*.ts"],
    "parser": "@typescript-eslint/parser",
    "rules": {
      "no-undef": "off",
      "no-unused-vars": "off",
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }]
    }
  },
  "parser": "@typescript-eslint/parser",
  "plugins": ["json", "jest", "@typescript-eslint"],
  "env": {
    "jest/globals": true
  }
}
