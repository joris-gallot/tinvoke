import type { InvokeOptions } from '@tauri-apps/api/core'
import type { RouteMap, RouteName } from './types.js'
import { invoke } from '@tauri-apps/api/core'

export type { RouteDefinition, RouteMap, RouteName } from './types.js'

// Overload for routes without args (no second parameter)
export function tinvoke<C extends RouteName>(
  cmd: RouteMap[C]['args'] extends never ? C : never
): Promise<RouteMap[C]['response']>

// Overload for routes without args (with options)
export function tinvoke<C extends RouteName>(
  cmd: RouteMap[C]['args'] extends never ? C : never,
  options: InvokeOptions
): Promise<RouteMap[C]['response']>

// Overload for routes with args (no options)
export function tinvoke<C extends RouteName>(
  cmd: RouteMap[C]['args'] extends never ? never : C,
  args: RouteMap[C]['args']
): Promise<RouteMap[C]['response']>

// Overload for routes with args (with options)
export function tinvoke<C extends RouteName>(
  cmd: RouteMap[C]['args'] extends never ? never : C,
  args: RouteMap[C]['args'],
  options: InvokeOptions
): Promise<RouteMap[C]['response']>

export function tinvoke<C extends RouteName>(
  cmd: C,
  argsOrOptions?: RouteMap[C]['args'] | InvokeOptions,
  options?: InvokeOptions,
): Promise<RouteMap[C]['response']> {
  // If we have 3 arguments, second is args, third is options
  if (arguments.length === 3) {
    // @ts-expect-error // TypeScript will infer the correct types based on overloads
    return invoke(cmd, argsOrOptions, options)
  }

  // If we have 2 arguments, need to determine if second is args or options
  if (arguments.length === 2) {
    // For routes that don't need args, second parameter is options
    if (argsOrOptions && typeof argsOrOptions === 'object'
      && ('headers' in argsOrOptions || 'timeout' in argsOrOptions || 'signal' in argsOrOptions)) {
      return invoke(cmd, undefined, argsOrOptions as InvokeOptions)
    }

    return invoke(cmd, argsOrOptions, undefined)
  }

  return invoke(cmd, undefined, undefined)
}
