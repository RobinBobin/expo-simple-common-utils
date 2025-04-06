import eslintConfig from '@robinbobin/ts-eslint-prettier/eslint.config.mjs'

/** @type unknown[] */
const array = [
  ...eslintConfig,
  {
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': [
        'error',
        { ignoreInferredTypes: true }
      ]
    }
  }
]

export default array
