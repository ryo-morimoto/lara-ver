import antfu from '@antfu/eslint-config'

export default antfu({
  react: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
})
