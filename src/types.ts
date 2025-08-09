export interface RouteDefinition<Response, Args = never> {
  response: Response
  args: Args
}

export interface RouteMap {}

export type RouteName = keyof RouteMap
