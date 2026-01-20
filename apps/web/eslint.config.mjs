//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['.output/**', '*.config.js'],
  },
  ...tanstackConfig,
]
