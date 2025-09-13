import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins:[(tsconfigPaths())],
  test:{
    dir:'src',
    projects:[
      {
        extends:true,
        test:{
          name:'unit',
          dir:'src/use-cases'
        }
      }
    ],
    globals:true,
    coverage:{
      all:false
    }
  }
})