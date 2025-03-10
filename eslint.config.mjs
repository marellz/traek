// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
export default withNuxt(
  // Your custom configs here
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-multiple-template-root': 'off',
      'vue/require-default-prop': 'off',
    },
  },
)
