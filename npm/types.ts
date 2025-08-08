export interface RouteDefinition<Response, Args = never> {
  response: Response
  args: Args
}
