import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftDelete1685457118564 implements MigrationInterface {
  name = 'SoftDelete1685457118564';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`deletedAt\` datetime(6) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`name\` \`name\` enum ('find_all_users', 'find_one_user', 'create_user', 'update_user', 'delete_user', 'restore_user', 'find_all_roles', 'find_one_role', 'create_role', 'update_role', 'delete_role') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`permissions\` CHANGE \`name\` \`name\` enum ('find_all_users', 'find_one_user', 'create_user', 'update_user', 'delete_user', 'find_all_roles', 'find_one_role', 'create_role', 'update_role', 'delete_role') NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deletedAt\``);
  }
}
