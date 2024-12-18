module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // Unused variable error
    'no-unused-vars': 'error',

    // Undefined variable error
    'no-undef': 'error',

    // allowed console
    'no-console': 'off',

    // Semicolon optional
    semi: ['error', 'always'],

    // Allows the introduction of dependencies in development dependencies
    'import/no-extraneous-dependencies': 'off',

    // Double quotes are allowed
    // quotes: ["error", "double", { avoidEscape: true }],

    // Do not force camelCase naming
    camelcase: 'off',

    // Allow spaces before functions
    'space-before-function-paren': 'off',

    // Allow appropriate undefined
    'no-undefined': 'off',

    // Allow appropriate null
    'no-null': 'off',

    // Use 2 spaces for indentation
    indent: [
      'error',
      2,
      {
        ignoredNodes: ['ConditionalExpression *', 'CallExpression *'],
        SwitchCase: 1,
        flatTernaryExpressions: true,
        offsetTernaryExpressions: true,
      },
    ],

    // allow appropriate callbacks
    'callback-return': 'off',

    // Allow commonjs require
    'global-require': 'off',

    // Use trailing commas when allowing multiple lines
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never', // Function parameters do not use trailing commas
      },
    ],
  },
};
