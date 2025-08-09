# tinvoke

Type-safe wrapper for Tauri's invoke function.

## Installation

```bash
npm install tinvoke
```

## Quick Setup

### 1. Add ts-rs dependency and export Rust types

Follow the setup guide at [ts-rs](https://github.com/Aleph-Alpha/ts-rs#get-started)

### 2. Configure TypeScript types

```typescript
import type { User } from 'path/to/bindings/User'
import type { Command } from 'tinvoke'

declare module 'tinvoke' {
  interface CommandsMap {
    get_user: Command<User, { name: string }>
  }
}
```

## Usage

```typescript
import { tinvoke } from 'tinvoke'

// user will be typed as User
const user = await tinvoke('get_user', { name: 'Alice' })
```

## License

MIT
