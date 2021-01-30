import { RequestHandler } from "express";

export enum METHOD {
  GET = "get",
  POST = "post",
  PUT = "put",
  PATCH = "patch",
  DELETE = "delete",
}

export default interface IRoute {
  method: METHOD;
  path: string;
  cbs: RequestHandler[];
}
