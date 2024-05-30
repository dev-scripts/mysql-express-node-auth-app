import passport from "passport";
import bcrypt from "bcrypt";
import randtoken from "rand-token";
import { UserRepository } from "../repositories/user.repository";
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordLinkRequest,
  ResetPasswordRequest,
} from "../requests/auth";
import { User, UserI } from "@src/entities";
import { sendEmail } from "./../configs/mail.config";
import { envVariables } from "./../configs/env.variables";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async register(req: RegisterRequest) {
    const userExists = await this.userRepository.isUserExists(req.email);

    if (!userExists) {
      const passwordHash = await bcrypt.hash(req.password, 8);
      req.password = passwordHash;
      const emailVerificationHash = randtoken.uid(200);
      const user = await this.userRepository.save(req, emailVerificationHash);

      const message = `Dear ${req.first_name},<br /><br />
         <strong>Thanks for joining {your project name}!</strong><br /><br />
         Please click on the link below to verify your email address:<br />
         <a href='${envVariables.WEB_APP_BASE_URL}/verification?hash=${user?.emailVerificationHash}' target='_blank'>Verify Email</a><br /><br />
         Warm Regards,<br />
         {your project name}`;

      sendEmail(req.email, "Verify your email address", message);

      return user;
    } else {
      console.log("User already exists!");
      throw new Error("User already exists!");
    }
  }

  public async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.userRepository.updateRefreshToken(id, refreshToken);
    return user;
  }

  public async login(req: LoginRequest): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      passport.authenticate(
        "local",
        { session: false },
        (err: Error, user: User, info: any) => {
          if (err) {
            reject(new Error("Internal Server Error."));
          }

          if (!user) {
            reject(new Error("Invalid username or password."));
          }

          if (user) {
            const message = `Dear ${user.firstName},    <br />
           <br/> We hope this email finds you well. We would like to bring to your attention a 
           recent login attempt made on your account.
            <br />   <br />
            Warm Regards, <br />
            {your project name}
            `;
            sendEmail(req.email, "Login Attempt", message);
          }

          resolve(user);
        }
      )({ body: { email: req.email, password: req.password } }, null, null);
    });
  }

  public async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  public async verify(emailVerificationHash: string): Promise<User | null> {
    const user = await this.userRepository.findByEmailVerificationHash(
      emailVerificationHash
    );
    if (user !== null) {
      user.active = 1;
      user.verifiedAt = new Date();
      await this.userRepository.verify(user);
    }

    return user;
  }

  public async sendPasswordResetLink(
    req: ResetPasswordLinkRequest
  ): Promise<User | null> {
    const passwordResetHash = randtoken.uid(200);
    const user = await this.userRepository.savePasswordResetHash(
      req.email,
      passwordResetHash
    );

    if (user) {
      const message = `Dear ${user.firstName},<br /><br />
         To change your password, click the link below:<br />
         <a href='${envVariables.WEB_APP_BASE_URL}/reset-passeord?hash=${user?.passwordResetHash}' target='_blank'>Change Password</a><br /><br />

         <strong> If you didn’t make this request, please disregard this email and make sure you can still login to your account.</strong><br /><br />

         Warm Regards,<br />
         {your project name}`;
      sendEmail(req.email, "Reset your password", message);

      return user;
    } else {
      return null;
    }
  }

  public async isValidPasswordResetLink(
    passwordResetHash: string
  ): Promise<boolean> {
    const user =
      await this.userRepository.findByPasswordResetHash(passwordResetHash);
    if (user !== null) {
      return true;
    }

    return false;
  }

  public async resetPassword(req: ResetPasswordRequest): Promise<User | null> {
    const passwordHash = await bcrypt.hash(req.password, 8);
    const user = await this.userRepository.findByPasswordResetHash(
      req.passwordResetHash
    );
    if (user !== null) {
      req.password = passwordHash;
      return this.userRepository.savePassword(req);
    }

    return user;
  }
}
