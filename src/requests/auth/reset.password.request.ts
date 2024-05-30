import { Required, MaxLength, MinLength } from "joi-typescript-validator";

export class ResetPasswordRequest {
  @Required()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Required()
  @MinLength(6)
  @MaxLength(20)
  confirmPassword: string;

  @Required()
  @MinLength(200)
  passwordResetHash: string;
}
