export interface UserI {
  id: number;
  firstName: string;
  lastName: string;
  emailAddress: string;
  emailVerificationHash: string;
  passwordResetHash: string;
  refreshToken: string | null;
  password: string;
  active: Number;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
