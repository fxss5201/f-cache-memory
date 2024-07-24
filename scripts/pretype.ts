
import { writeFile } from 'fs/promises'
import path from 'path'

async function pretypeFn () {
  await writeFile(path.resolve(path.resolve(), 'tsconfig.json'), JSON.stringify(pretype, null, 2))
}

const pretype = {
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "emitDeclarationOnly": true,
    "declaration": true,
    "declarationDir": "types"
  },
  "include": ["lib"]
}

pretypeFn()
