import type { InvokeOptions } from '@tauri-apps/api/core'
import type { RouteName } from '../tinvoke.js'
import { assertType, beforeEach, describe, it, vi } from 'vitest'
import { tinvoke } from '../tinvoke.js'

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(() => Promise.resolve(null)),
}))

describe('tinvoke type tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should accept routes without args', () => {
    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user'))
    assertType<Promise<string[]>>(tinvoke('list_files'))
  })

  it('should accept routes without args with options', () => {
    const options: InvokeOptions = { headers: { 'Custom-Header': 'value' } }
    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke('get_user', options))
    assertType<Promise<string[]>>(tinvoke('list_files', options))
  })

  it('should accept routes with args', () => {
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }))
    assertType<Promise<boolean>>(tinvoke('delete_item', { itemId: 123 }))
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'dark', language: 'en' }))
  })

  it('should accept routes with args and options', () => {
    const options: InvokeOptions = { headers: { 'Custom-Header': 'value' } }
    assertType<Promise<{ taskId: string }>>(tinvoke('create_task', { title: 'Test', description: 'Description' }, options))
    assertType<Promise<boolean>>(tinvoke('delete_item', { itemId: 123 }, options))
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'light', language: 'fr' }, options))
  })

  it('should constrain route names to valid keys', () => {
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

  it('should validate RouteName type', () => {
    const route1: RouteName = 'get_user'
    const route2: RouteName = 'create_task'
    const route3: RouteName = 'delete_item'
    const route4: RouteName = 'list_files'
    const route5: RouteName = 'update_settings'

    assertType<Promise<{ id: number, name: string, email: string }>>(tinvoke(route1))
    assertType<Promise<{ taskId: string }>>(tinvoke(route2, { title: 'Test', description: 'Test description' }))
    assertType<Promise<boolean>>(tinvoke(route3, { itemId: 123 }))
    assertType<Promise<string[]>>(tinvoke(route4))
    assertType<Promise<void>>(tinvoke(route5, { theme: 'dark', language: 'en' }))
  })

  it('should handle theme options correctly', () => {
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'light', language: 'en' }))
    assertType<Promise<void>>(tinvoke('update_settings', { theme: 'dark', language: 'fr' }))
  })

  it('error cases - should not compile', () => {
    // @ts-expect-error - Passing args to route that doesn't need them
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

    // @ts-expect-error - Invalid route name
    tinvoke('invalid_route')

    // @ts-expect-error - Passing args to list_files which doesn't need them
    tinvoke('list_files', { someParam: 'value' })

    // @ts-expect-error - Wrong property names
    tinvoke('delete_item', { id: 123 })

    // @ts-expect-error - Missing language property
    tinvoke('update_settings', { theme: 'dark' })
  })
})
