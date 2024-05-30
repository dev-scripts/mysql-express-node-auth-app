import { Required, MinLength } from "joi-typescript-validator";

export class TokenRequest {
  @Required()
  @MinLength(200)
  public fefreshToken: string;
}
