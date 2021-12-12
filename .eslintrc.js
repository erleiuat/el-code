/* eslint-disable @typescript-eslint/naming-convention */

module.exports = {
  env: {
    browser : true,
    node    : true,
  },
  extends        : [ 'eslint-config-joppala' ],
  ignorePatterns : [
    'out',
    'dist',
    '**/*.d.ts',
  ],
  parser        : '@typescript-eslint/parser',
  parserOptions : {
    ecmaVersion : 6,
    sourceType  : 'module',
  },
  plugins : [ '@typescript-eslint' ],
  root    : true,
  rules   : {},
}
