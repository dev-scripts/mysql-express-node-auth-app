import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1707005739450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            firstName VARCHAR(50) NOT NULL,
            lastName VARCHAR(50) NOT NULL,
            emailAddress VARCHAR(255) NOT NULL,
            refreshToken TEXT,
            password VARCHAR(255) NOT NULL,
            active TINYINT DEFAULT 0,
            emailVerificationHash VARCHAR(255),
            passwordResetHash VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
