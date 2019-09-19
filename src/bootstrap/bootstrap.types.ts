import * as Express from "express";

export type HttpMethods =
  | "post"
  | "get"
  | "delete"
  | "put"
  | "patch"
  | "options"
  | "head"
  | "copy"
  | "link"
  | "unlink"
  | "purge"
  | "lock"
  | "unlock"
  | "propfind"
  | "view";

export interface Mock {
  path: string | RegExp;
  method: HttpMethods;
  handler: Express.RequestHandler;
}

export interface IBootstrapConfig {
  declaration: string;
  port: number;
  mocks: { [path: string]: string };
  additionalMocks: Mock[];
}

type RestHandler = (params: { [param: string]: string }, body: any) => any;
export interface RestHandlers {
  get: RestHandler;
  post: RestHandler;
  delete: RestHandler;
  put: RestHandler;
}
