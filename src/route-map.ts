import { RouteDefinition } from "./types.js";

export type RouteMap = {
  get_user: RouteDefinition<{ id: number; name: string; email: string }>;
  create_task: RouteDefinition<{ taskId: string }, { title: string; description: string }>;
  delete_item: RouteDefinition<boolean, { itemId: number }>;
  list_files: RouteDefinition<string[]>;
  update_settings: RouteDefinition<void, { theme: 'light' | 'dark'; language: string }>;
}

export type RouteName = keyof RouteMap
