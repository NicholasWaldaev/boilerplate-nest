import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAvatar1685366950874 implements MigrationInterface {
  name = 'UsersAvatar1685366950874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`avatarUrl\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`avatarUrl\``);
  }
}
