import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifiedAt1707006229778 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users 
        ADD COLUMN verifiedAt TIMESTAMP NULL AFTER active;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE users DROP COLUMN verifiedAt`);
  }
}
