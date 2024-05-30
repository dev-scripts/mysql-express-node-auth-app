import {
  Required,
  MaxLength,
  Email,
  MinLength,
} from "joi-typescript-validator";

export class LoginRequest {
  @Required()
  @MinLength(6)
  @Email()
  public email: string;

  @Required()
  @MaxLength(8)
  @MinLength(1)
  public password: string;
}
