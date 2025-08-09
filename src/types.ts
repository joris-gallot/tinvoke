export interface Command<Response, Args = never> {
  response: Response
  args: Args
}

export interface CommandsMap {}

export type CommandName = keyof CommandsMap
