import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig(
  {
    entries: [
      {
        input: 'npm/tinvoke.ts',
        name: 'tinvoke',
      },
    ],
    declaration: true,
  },
)
