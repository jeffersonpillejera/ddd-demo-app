export interface Command<IRequest> {
  execute(request?: IRequest): Promise<void> | void;
}
