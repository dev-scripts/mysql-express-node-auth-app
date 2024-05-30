import {
  Required,
  MaxLength,
  Email,
  MinLength,
  Nullable,
} from "joi-typescript-validator";

export class RegisterRequest {
  @Required()
  @MinLength(1)
  @MaxLength(20)
  first_name: string;

  @Required()
  @MinLength(1)
  @MaxLength(20)
  last_name: string;

  @Required()
  @Email()
  @MaxLength(255)
  email: string;

  @Required()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @Required()
  @MinLength(6)
  @MaxLength(20)
  confirm_password: string;
}
