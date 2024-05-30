// user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserI } from "./user.interface";

@Entity("users_1")
export class User implements UserI {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  emailAddress: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column()
  password: string;

  @Column()
  active: Number;

  @Column({ nullable: true })
  verifiedAt: Date;

  @Column({ nullable: true })
  emailVerificationHash: string;

  @Column({ nullable: true })
  passwordResetHash: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
