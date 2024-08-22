import { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrationName1724166118329 implements MigrationInterface {
  name = 'MigrationName1724166118329';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Teams\` CHANGE \`inviteToken\` \`inviteToken\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Teams\` CHANGE \`inviteToken\` \`inviteToken\` varchar(255) NOT NULL`,
    );
  }
}
