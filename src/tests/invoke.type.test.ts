import type { InvokeOptions } from '@tauri-apps/api/core'
import type { Command, CommandName } from '../tinvoke.js'
import { assertType, beforeEach, describe, it, vi } from 'vitest'
import { tinvoke } from '../tinvoke.js'

declare module '../tinvoke.js' {
  interface CommandsMap {
    get_user: Command<{ id: number, name: string, email: string }>
    create_task: Command<{ taskId: string }, { title: string, description: string }>
    delete_item: Command<boolean, { itemId: number }>
    list_files: Command<string[]>
    update_settings: Command<void, { theme: 'light' | 'dark', language: string }>
  }
}

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(() => Promise.resolve(null)),
}))

describe('tinvoke type tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should accept commands without args', () => {
    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user'))
    assertType<Promise<string[]>>(tinvoke('list_files'))
  })

  it('should accept commands without args with options', () => {
    const options: InvokeOptions = { headers: { 'Custom-Header': 'value' } }
    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user', options))
    assertType<Promise<string[]>>(tinvoke('list_files', options))
  })

  it('should accept commands with args', () => {
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }))
    assertType<Promise<boolean>>(tinvoke('delete_item', { itemId: 123 }))
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'dark', language: 'en' }))
  })

  it('should accept commands with args and options', () => {
    const options: InvokeOptions = { headers: { 'Custom-Header': 'value' } }
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }, options))
    assertType<Promise<boolean>>(tinvoke('delete_item', { itemId: 123 }, options))
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'light', language: 'fr' }, options))
  })

  it('should constrain command names to valid keys', () => {
    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user'))
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }))
    assertType<Promise<string[]>>(tinvoke('list_files'))
  })

  it('should maintain correct return types for get_user', () => {
    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user'))

    const options: InvokeOptions = { headers: {} }
    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user', options))
  })

  it('should maintain correct return types for create_task', () => {
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }))

    const options: InvokeOptions = { headers: {} }
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }, options))
  })

  it('should require correct argument types for create_task', () => {
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Task 1', description: 'First task' }))
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Task 2', description: 'Second task' }))
  })

  it('should work with different InvokeOptions configurations', () => {
    const options1: InvokeOptions = { headers: { Authorization: 'Bearer token' } }
    const options2: InvokeOptions = { headers: { 'Content-Type': 'application/json' } }

    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user', options1))
    assertType<Promise<string[]>>(tinvoke('list_files', options2))
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }, options1))
    assertType<Promise<boolean>>(tinvoke('delete_item', { itemId: 456 }, options2))
  })

  it('should handle complex argument structures', () => {
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: '', description: '' }))
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Very Long Task Name With Spaces', description: 'A very detailed description' }))
    assertType<Promise<boolean>>(tinvoke('delete_item', { itemId: 0 }))
    assertType<Promise<boolean>>(tinvoke('delete_item', { itemId: 999999 }))
  })

  it('should validate CommandName type', () => {
    const command1: CommandName = 'get_user'
    const command2: CommandName = 'create_task'
    const command3: CommandName = 'delete_item'
    const command4: CommandName = 'list_files'
    const command5: CommandName = 'update_settings'

    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke(command1))
    assertType<Promise<{ taskId: string }>>(tinvoke(command2, { title: 'Test', description: 'Test description' }))
    assertType<Promise<boolean>>(tinvoke(command3, { itemId: 123 }))
    assertType<Promise<string[]>>(tinvoke(command4))
    assertType<Promise<void>>(tinvoke(command5, { theme: 'dark', language: 'en' }))
  })

  it('should handle theme options correctly', () => {
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'light', language: 'en' }))
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'dark', language: 'fr' }))
  })

  it('error cases - should not compile', () => {
    // @ts-expect-error - Passing args to command that doesn't need them
    tinvoke('get_user', { someArg: 'value' })

    // @ts-expect-error - Not passing required args
    tinvoke('create_task')

    // @ts-expect-error - Wrong argument type
    tinvoke('create_task', { title: 123, description: 'test' })

    // @ts-expect-error - Missing required properties
    tinvoke('create_task', { title: 'test' })

    // @ts-expect-error - Wrong itemId type
    tinvoke('delete_item', { itemId: 'not-a-number' })

    // @ts-expect-error - Invalid theme value
    tinvoke('update_settings', { theme: 'blue', language: 'en' })

    // @ts-expect-error - Invalid command name
    tinvoke('invalid_command')

    // @ts-expect-error - Passing args to list_files which doesn't need them
    tinvoke('list_files', { someParam: 'value' })

    // @ts-expect-error - Wrong property names
    tinvoke('delete_item', { id: 123 })

    // @ts-expect-error - Missing language property
    tinvoke('update_settings', { theme: 'dark' })
  })
})
