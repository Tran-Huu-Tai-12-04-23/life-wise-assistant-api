import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1724580482768 implements MigrationInterface {
    name = 'MigrationName1724580482768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`TeamPermissions\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`isAdmin\` tinyint NOT NULL, \`isEdit\` tinyint NOT NULL, \`isDelete\` tinyint NOT NULL, \`isCreate\` tinyint NOT NULL, \`isAssign\` tinyint NOT NULL, \`userId\` varchar(255) NOT NULL, \`teamId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Notifications\` ADD \`subTitle\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Notifications\` ADD \`linkTarget\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Notifications\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` ADD CONSTRAINT \`FK_3f73caeb4f96499fb68669edd17\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` ADD CONSTRAINT \`FK_c05f7dea0843785c91f95162347\` FOREIGN KEY (\`teamId\`) REFERENCES \`Teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` DROP FOREIGN KEY \`FK_c05f7dea0843785c91f95162347\``);
        await queryRunner.query(`ALTER TABLE \`TeamPermissions\` DROP FOREIGN KEY \`FK_3f73caeb4f96499fb68669edd17\``);
        await queryRunner.query(`ALTER TABLE \`Notifications\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`Notifications\` DROP COLUMN \`linkTarget\``);
        await queryRunner.query(`ALTER TABLE \`Notifications\` DROP COLUMN \`subTitle\``);
        await queryRunner.query(`DROP TABLE \`TeamPermissions\``);
    }

}
