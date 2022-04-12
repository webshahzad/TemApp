module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'project': './tsconfig.json',
    'ecmaVersion': 6,
    'sourceType': 'module',
    'ecmaFeatures': {
      'modules': true
    }
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'file-progress',
  ],
  rules: {
    'file-progress/activate': 1,
    'linebreak-style': ['error', 'unix'],
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 0, maxBOF: 0 }],
    'quotes': ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    'semi': ['error', 'never'],
    'prefer-const': 'error',
    'comma-dangle': ['error', {
      'arrays': 'only-multiline',
      'objects': 'always-multiline',
      'imports': 'only-multiline',
      'exports': 'only-multiline',
      'functions': 'never',
    }],
    'no-trailing-spaces': 'error',
    'no-unexpected-multiline': 'error',
    'object-shorthand': ['error', 'always'],
    // 'import-order': 'off',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    // '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/strict-boolean-expressions': ['error', {
      allowNullableObject: true,
      allowNullableString: true,
      allowNullableBoolean: true,
      allowAny: true,
    }],
    'no-useless-rename': 'error',
    'react/jsx-indent': ['error', 2], // enforces jsx indents of 2 spaces
    'arrow-parens': ['error', 'as-needed'], // braces around single parameter in arrow functions are forbidden
    'react/jsx-boolean-value': ['error', 'never'], // booleanProp={true} is forbidden
    'react/jsx-closing-bracket-location': ['error', 'tag-aligned'], // jsx closing tags should be on new line
    'react/jsx-closing-tag-location': 'error', // jsx closing tags must be properly aligned
    'react/jsx-wrap-multilines': 'error', // enforces braces around jsx
    'react/jsx-key': ['error', { checkFragmentShorthand: true }], // detects missing key prop
    'react/jsx-first-prop-new-line': ['error', 'multiline'], // enforces first to be placed on new line when
    'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }], // enforces props to be placed on new lines when jsx is multiline
    'react/jsx-props-no-multi-spaces': ['error'], // detects multiple spaced between props
    'react-native/no-raw-text': 'off', // detects raw text outside of <Text></Text>
    'react-native/no-unused-styles': ['warn'], // forbids unused styles
    'react-native/no-inline-styles': 'off', // forbids inline styles
    'react-native/no-single-element-style-arrays': ['warn'], // forbids styles in array with single element
  }
}
