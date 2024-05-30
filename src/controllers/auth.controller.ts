import {
  Get,
  Path,
  Post,
  Route,
  Example,
  SuccessResponse,
  Body,
  Controller,
  Security,
  Header,
  Response as TSOAResponse,
  Request,
  Tags,
} from "tsoa";
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordLinkRequest,
  ResetPasswordRequest,
} from "../requests/auth";
import { Validate } from "joi-typescript-validator";
import * as jwt from "jsonwebtoken";
import { ErrorResponse } from "../error";
import {
  AuthenticatedUserResponse,
  TokenResponse,
  RegisterResponse,
  RefreshTokenResponse,
} from "../interfaces/auth";
import { AuthService } from "./../services/auth.service";
import { envVariables } from "./../configs";
import randtoken from "rand-token";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  @Example<RegisterResponse>({
    id: 1,
    name: "Prakash Bhandari",
    email: "hello@prakashbhandari.com.np",
  })
  @Post("/register")
  @TSOAResponse<RegisterResponse>(200, "OK")
  @TSOAResponse<ErrorResponse>(401, "User already exists!")
  @TSOAResponse<ErrorResponse>(500, "Internal Server Error")
  public async register(
    @Body() req: RegisterRequest
  ): Promise<RegisterResponse | ErrorResponse> {
    try {
      const { error } = Validate(RegisterRequest, req);

      if (error) {
        this.setStatus(422);
        return { message: error.message };
      }

      if (req.password != req.confirm_password) {
        this.setStatus(422);
        return { message: "Confirm password mismatched." };
      }

      const user = await this.authService.register(req);

      if (!user) {
        this.setStatus(422);
        return { message: "User details not available after registration." };
      }

      return {
        id: user?.id,
        name: user?.firstName,
        email: user.emailAddress,
      };
    } catch (error) {
      if (error instanceof Error) {
        this.setStatus(422);
        return { message: error.message };
      } else {
        this.setStatus(500);
        return { message: "Unexpected error." };
      }
    }
  }

  @Example<RefreshTokenResponse>({
    refreshToken: "52907745-7672-470e-a803-a2f8feb52944",
  })
  @Post("/login")
  public async login(
    @Body() req: LoginRequest
  ): Promise<RefreshTokenResponse | ErrorResponse> {
    try {
      const { error } = Validate(LoginRequest, req);

      if (error) {
        this.setStatus(422);
        return { message: error.message };
      }

      const user = await this.authService.login(req);

      var refreshToken = randtoken.uid(256);
      const token = jwt.sign(
        {
          id: user.id,
        },
        envVariables.SECRET_TOKEN,
        {
          noTimestamp: true,
          expiresIn: "24h",
        }
      );

      refreshToken = token + refreshToken;

      await this.authService.updateRefreshToken(user?.id, refreshToken);

      return { refreshToken: refreshToken };
    } catch (error) {
      if (error instanceof Error) {
        this.setStatus(422);
        return { message: error.message };
      } else {
        this.setStatus(500);
        return { message: "Unexpected error." };
      }
    }
  }

  @Example<TokenResponse>({
    token: "52907745-7672-470e-a803-a2f8feb52944",
  })
  @Get("token/{refreshToken}")
  public async token(
    @Path() refreshToken: string
  ): Promise<TokenResponse | ErrorResponse> {
    try {
      const decodedToken: any = jwt.decode(refreshToken);
      const user = await this.authService.findById(+decodedToken.id);
      jwt.verify(refreshToken, envVariables.SECRET_TOKEN, function (err: any) {
        if (err) {
          return { message: "Refresh token has expired" };
        }
      });

      if (user) {
        const token = jwt.sign(
          {
            id: user.id,
            username: user?.emailAddress,
          },
          envVariables.SECRET_TOKEN,
          {
            noTimestamp: true,
            expiresIn: "24h",
          }
        );
        return { token: token };
      } else {
        this.setStatus(422);
        return { message: "Could not get the refresh token." };
      }
    } catch (error) {
      if (error instanceof Error) {
        this.setStatus(422);
        return { message: error.message };
      } else {
        this.setStatus(500);
        return { message: "Unexpected error." };
      }
    }
  }

  @Get("verify/{emailVerificationCode}")
  public async verify(
    @Path() emailVerificationCode: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const user = await this.authService.verify(emailVerificationCode);
      if (user) {
        return true;
      } else {
        this.setStatus(422);
        return {
          message:
            "Invalid verification link or expired the verification link.",
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        this.setStatus(422);
        return { message: error.message };
      } else {
        this.setStatus(500);
        return { message: "Unexpected error." };
      }
    }
  }

  @Post("sendPasswordResetLink")
  public async sendPasswordResetLink(
    @Body() req: ResetPasswordLinkRequest
  ): Promise<boolean | ErrorResponse> {
    try {
      const user = await this.authService.sendPasswordResetLink(req);
      if (user) {
        return true;
      } else {
        this.setStatus(422);
        return { message: "Invalid email address." };
      }
    } catch (error) {
      if (error instanceof Error) {
        this.setStatus(422);
        return { message: error.message };
      } else {
        this.setStatus(500);
        return { message: "Unexpected error." };
      }
    }
  }

  @Get("isValidPasswordResetLink/{passwordResetHash}")
  public async isValidPasswordResetLink(
    @Path() passwordResetHash: string
  ): Promise<boolean | ErrorResponse> {
    try {
      const user =
        await this.authService.isValidPasswordResetLink(passwordResetHash);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        this.setStatus(422);
        return { message: error.message };
      } else {
        this.setStatus(500);
        return { message: "Unexpected error." };
      }
    }
  }

  @Post("/passwordReset")
  @TSOAResponse<RegisterResponse>(200, "OK")
  @TSOAResponse<ErrorResponse>(500, "Internal Server Error")
  public async passwordReset(
    @Body() req: ResetPasswordRequest
  ): Promise<boolean | ErrorResponse> {
    try {
      const { error } = Validate(ResetPasswordRequest, req);

      if (error) {
        this.setStatus(422);
        return { message: error.message };
      }

      if (req.password != req.confirmPassword) {
        this.setStatus(422);
        return { message: "Confirm password mismatched." };
      }

      const user = await this.authService.resetPassword(req);

      if (!user) {
        this.setStatus(422);
        return { message: "Password coul not be updated." };
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        this.setStatus(422);
        return { message: error.message };
      } else {
        this.setStatus(500);
        return { message: "Unexpected error." };
      }
    }
  }

  @Security("jwt")
  @Post("/me")
  @TSOAResponse("401", "Unauthorized")
  @SuccessResponse("200", "OK")
  public async me(
    @Header("X-Access-Token") authorization: string
  ): Promise<AuthenticatedUserResponse | null | ErrorResponse> {
    try {
      const token: any = authorization;
      const decodedToken: any = jwt.decode(token);

      if (!decodedToken || !decodedToken.id) {
        this.setStatus(401);
        return { message: "Unauthorized" };
      }

      const user = await this.authService.findById(decodedToken.id);

      if (!user) {
        this.setStatus(404);
        return { message: "Invalid user." };
      }

      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
      };
    } catch (err) {
      this.setStatus(500);
      return { message: "Internal Server Error" };
    }
  }
}
