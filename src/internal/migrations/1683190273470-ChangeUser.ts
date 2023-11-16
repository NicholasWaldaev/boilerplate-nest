import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUser1683190273470 implements MigrationInterface {
  name = 'ChangeUser1683190273470';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`refresh_token\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`restore_password_token\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`restore_password_token\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`refresh_token\` varchar(255) NULL`,
    );
  }
}
