import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1724590530385 implements MigrationInterface {
    name = 'MigrationName1724590530385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` ADD \`isInvite\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` DROP COLUMN \`isInvite\``);
    }

}
