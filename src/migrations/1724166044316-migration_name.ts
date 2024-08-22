import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1724166044316 implements MigrationInterface {
  name = 'MigrationName1724166044316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Teams\` ADD \`inviteTokenExpiredDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Teams\` DROP COLUMN \`inviteTokenExpiredDate\``,
    );
  }
}
