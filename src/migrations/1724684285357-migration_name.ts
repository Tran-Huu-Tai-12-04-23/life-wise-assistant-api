import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1724684285357 implements MigrationInterface {
    name = 'MigrationName1724684285357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isAdmin\` \`isAdmin\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isEdit\` \`isEdit\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isDelete\` \`isDelete\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isCreate\` \`isCreate\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isAssign\` \`isAssign\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isInvite\` \`isInvite\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isInvite\` \`isInvite\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isAssign\` \`isAssign\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isCreate\` \`isCreate\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isDelete\` \`isDelete\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isEdit\` \`isEdit\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` CHANGE \`isAdmin\` \`isAdmin\` tinyint NOT NULL`);
    }

}
