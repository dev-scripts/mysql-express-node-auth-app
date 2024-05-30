// UserRepository.ts
import { dataSource } from "./../configs";
import { User, UserI } from "./../entities";
import { Repository, IsNull } from "typeorm";
import { RegisterRequest, ResetPasswordRequest } from "../requests/auth";
// Interface
interface UserRepositoryI {
  save(
    res: RegisterRequest,
    emailVerificationHash: string
  ): Promise<User | null>;
  isUserExists(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
  updateRefreshToken(id: number, refreshToken: string): Promise<User | null>;
  findByEmailVerificationHash(
    emailVerificationHash: string
  ): Promise<User | null>;
  savePasswordResetHash(
    email: string,
    passwordResetHash: string
  ): Promise<User | null>;
  findByPasswordResetHash(passwordResetHash: string): Promise<User | null>;
  savePassword(req: ResetPasswordRequest): Promise<User | null>;
}

//actual class
export class UserRepository implements UserRepositoryI {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.manager.getRepository(User);
  }

  async save(
    req: RegisterRequest,
    emailVerificationHash: string
  ): Promise<User | null> {
    try {
      const user = new User();
      user.emailAddress = req.email;
      user.firstName = req.first_name;
      user.lastName = req.last_name;
      user.password = req.password;
      user.emailVerificationHash = emailVerificationHash;

      return await this.userRepository.save(user);
    } catch (error) {
      console.error("Error saving user:", error);
      return null;
    }
  }

  async isUserExists(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findOne({
      where: { emailAddress: email },
    });

    return !!existingUser; // Return true if the user exists, false otherwise
  }

  async updateRefreshToken(
    id: number,
    refreshToken: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (user) {
      user.refreshToken = refreshToken;
      return await this.userRepository.save(user);
    }

    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { emailAddress: email },
    });

    return user;
  }

  async findVerifiedUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        emailAddress: email,
        active: 1,
      },
    });

    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    return user;
  }

  async findByEmailVerificationHash(
    emailVerificationHash: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationHash: emailVerificationHash,
        active: 0,
        verifiedAt: IsNull(),
      },
    });

    return user;
  }

  async verify(user: User): Promise<User | null> {
    try {
      return await this.userRepository.save(user);
    } catch (error) {
      console.error("Error saving user:", error);
      return null;
    }
  }

  async savePasswordResetHash(
    email: string,
    passwordResetHash: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { emailAddress: email },
    });
    if (user) {
      user.passwordResetHash = passwordResetHash;
      return await this.userRepository.save(user);
    }

    return null;
  }

  async findByPasswordResetHash(
    passwordResetHash: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: {
        passwordResetHash: passwordResetHash,
      },
    });

    return user;
  }

  async savePassword(req: ResetPasswordRequest): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { passwordResetHash: req.passwordResetHash },
    });
    if (user) {
      user.password = req.password;
      user.passwordResetHash = "";
      return await this.userRepository.save(user);
    }

    return null;
  }
}

export default UserRepository;
