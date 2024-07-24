import { writeFile } from 'fs/promises'
import path from 'path'

async function posttypeFn () {
  await writeFile(path.resolve(path.resolve(), 'tsconfig.json'), JSON.stringify(posttype, null, 2))
}

const posttype = {
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
    "noEmit": true
  },
  "include": ["src"]
}

posttypeFn()
