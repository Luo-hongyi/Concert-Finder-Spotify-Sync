import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        JSX: true,
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },
    rules: {
      // React basic rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'warn',
      'react/jsx-uses-vars': 'warn',
      'react/no-unknown-property': 'warn',
      'react/jsx-no-duplicate-props': 'warn',
      'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
      'react/jsx-fragments': ['warn', 'syntax'],
      'react/jsx-no-target-blank': ['warn', { allowReferrer: true }],
      'react/boolean-prop-naming': ['warn', { rule: '^(is|has|should|can|will|did)[A-Z]([A-Za-z0-9]?)+' }],
      'react/function-component-definition': [
        'warn',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/no-array-index-key': 'warn',
      'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
      'react/jsx-pascal-case': 'warn',
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          multiline: 'last',
          ignoreCase: true,
          reservedFirst: true,
        },
      ],
      'react/jsx-no-bind': [
        'warn',
        {
          ignoreDOMComponents: true,
          ignoreRefs: true,
          allowArrowFunctions: true,
          allowFunctions: false,
          allowBind: false,
        },
      ],
      'react/no-multi-comp': ['warn', { ignoreStateless: true }],
      'react/no-access-state-in-setstate': 'warn',
      'react/no-danger': 'warn',
      'react/no-did-mount-set-state': 'warn',
      'react/no-did-update-set-state': 'warn',
      'react/no-redundant-should-component-update': 'warn',
      'react/no-this-in-sfc': 'warn',
      'react/no-typos': 'warn',
      'react/no-unused-prop-types': 'warn',
      'react/no-unused-state': 'warn',
      'react/prefer-es6-class': ['warn', 'always'],
      'react/prefer-stateless-function': 'warn',
      'react/style-prop-object': 'warn',
      'react/void-dom-elements-no-children': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': [
        'warn',
        {
          additionalHooks: '(useRecoilCallback|useRecoilTransaction_UNSTABLE)',
          enableDangerousAutofixThisMayCauseInfiniteLoops: false,
        },
      ],

      // Fast Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import
      'import/first': 'warn',
      'import/no-duplicates': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'never',
          alphabetize: { order: 'asc' },
        },
      ],
      'import/no-unresolved': 'off',
      'import/no-cycle': 'warn',
      'import/no-self-import': 'warn',
      'import/newline-after-import': ['warn', { count: 1 }],
      'import/no-useless-path-segments': 'warn',
      'import/no-named-as-default': 'warn',
      'import/no-named-as-default-member': 'warn',
      'import/no-mutable-exports': 'warn',
      'import/no-unused-modules': 'warn',

      // Accessibility
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-proptypes': 'warn',
      'jsx-a11y/aria-unsupported-elements': 'warn',
      'jsx-a11y/heading-has-content': 'warn',
      'jsx-a11y/html-has-lang': 'warn',
      'jsx-a11y/iframe-has-title': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'jsx-a11y/media-has-caption': 'warn',

      // JavaScript general
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^React$|^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-alert': 'warn',
      'no-var': 'warn',
      'prefer-const': 'warn',
      'prefer-template': 'warn',
      'template-curly-spacing': ['warn', 'never'],
      'arrow-body-style': ['warn', 'as-needed'],
      'arrow-parens': ['warn', 'always'],
      'object-shorthand': 'warn',
      'array-callback-return': 'warn',
      eqeqeq: ['warn', 'always', { null: 'ignore' }],
      'no-else-return': 'warn',
      'no-nested-ternary': 'warn',
      'no-unneeded-ternary': 'warn',
      'spaced-comment': ['warn', 'always'],
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
      'no-param-reassign': ['warn', { props: true, ignorePropertyModificationsFor: ['state', 'draft'] }],
      'no-unused-expressions': ['warn', { allowShortCircuit: true, allowTernary: true }],
      'no-return-await': 'warn',
      'no-await-in-loop': 'warn',
      'require-atomic-updates': 'warn',
      'no-use-before-define': ['warn', { functions: false, classes: true, variables: true }],

      // ES6+ Features
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],
      'prefer-spread': 'warn',
      'prefer-rest-params': 'warn',
      // 'prefer-optional-chain': 'warn',
      // 'prefer-nullish-coalescing': 'warn',
      'no-duplicate-imports': 'warn',
      'no-const-assign': 'warn',
      'no-this-before-super': 'warn',
      'no-useless-constructor': 'warn',
      'no-useless-rename': 'warn',
      'no-useless-computed-key': 'warn',

      // Promise and error handling
      'prefer-promise-reject-errors': 'warn',
      'no-throw-literal': 'warn',
      'handle-callback-err': 'warn',
      'max-nested-callbacks': ['warn', 3],
      'no-promise-executor-return': 'warn',

      // Best Practices
      'default-case': 'warn',
      'default-case-last': 'warn',
      'dot-notation': 'warn',
      'no-floating-decimal': 'warn',
      'no-implicit-coercion': 'warn',
      'no-multi-spaces': 'warn',
      'no-useless-return': 'warn',
      'vars-on-top': 'warn',
      yoda: 'warn',
      curly: ['warn', 'multi-line'],
      'no-eval': 'warn',
      'no-implied-eval': 'warn',
      'no-invalid-this': 'warn',
      'no-iterator': 'warn',
      'no-labels': 'warn',
      'no-lone-blocks': 'warn',
      'no-loop-func': 'warn',
      'no-multi-str': 'warn',
      'no-new': 'warn',
      'no-new-func': 'warn',
      'no-new-wrappers': 'warn',
      'no-proto': 'warn',
      'no-return-assign': ['warn', 'always'],
      'no-script-url': 'warn',
      'no-self-compare': 'warn',
      'no-sequences': 'warn',
      'no-unused-private-class-members': 'warn',
      radix: 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
  },
  prettierConfig,
];
