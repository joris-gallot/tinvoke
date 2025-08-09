import type { InvokeOptions } from '@tauri-apps/api/core'
import type { CommandName, CommandsMap } from './types.js'
import { invoke } from '@tauri-apps/api/core'

export type { Command, CommandName, CommandsMap } from './types.js'

// Overload for commands without args (no second parameter)
export function tinvoke<C extends CommandName>(
  cmd: CommandsMap[C]['args'] extends never ? C : never
): Promise<CommandsMap[C]['response']>

// Overload for commands without args (with options)
export function tinvoke<C extends CommandName>(
  cmd: CommandsMap[C]['args'] extends never ? C : never,
  options: InvokeOptions
): Promise<CommandsMap[C]['response']>

// Overload for commands with args (no options)
export function tinvoke<C extends CommandName>(
  cmd: CommandsMap[C]['args'] extends never ? never : C,
  args: CommandsMap[C]['args']
): Promise<CommandsMap[C]['response']>

// Overload for commands with args (with options)
export function tinvoke<C extends CommandName>(
  cmd: CommandsMap[C]['args'] extends never ? never : C,
  args: CommandsMap[C]['args'],
  options: InvokeOptions
): Promise<CommandsMap[C]['response']>

export function tinvoke<C extends CommandName>(
  cmd: C,
  argsOrOptions?: CommandsMap[C]['args'] | InvokeOptions,
  options?: InvokeOptions,
): Promise<CommandsMap[C]['response']> {
  // If we have 3 arguments, second is args, third is options
  if (arguments.length === 3) {
    // @ts-expect-error // TypeScript will infer the correct types based on overloads
    return invoke(cmd, argsOrOptions, options)
  }

  // If we have 2 arguments, need to determine if second is args or options
  if (arguments.length === 2) {
    // For commands that don't need args, second parameter is options
    if (argsOrOptions && typeof argsOrOptions === 'object'
      && ('headers' in argsOrOptions || 'timeout' in argsOrOptions || 'signal' in argsOrOptions)) {
      return invoke(cmd, undefined, argsOrOptions as InvokeOptions)
    }

    return invoke(cmd, argsOrOptions, undefined)
  }

  return invoke(cmd, undefined, undefined)
}
