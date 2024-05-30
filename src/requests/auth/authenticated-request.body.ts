import { Request, Response } from "express";
import { UserI } from "./../../entities/user.interface";

export interface AuthenticatedRequestBody<T> extends Request {
  body: T;
  user?: UserI;
}
