import { Required, Email, MinLength } from "joi-typescript-validator";

export class ResetPasswordLinkRequest {
  @Required()
  @MinLength(6)
  @Email()
  public email: string;
}
