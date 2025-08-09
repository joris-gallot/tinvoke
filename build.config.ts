import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig(
  {
    entries: [
      {
        input: 'src/tinvoke.ts',
        name: 'tinvoke',
      },
    ],
    declaration: true,
  },
)
