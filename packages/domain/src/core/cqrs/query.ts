export interface Query<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
