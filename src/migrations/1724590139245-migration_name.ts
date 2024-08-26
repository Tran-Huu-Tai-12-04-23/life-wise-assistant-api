import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1724590139245 implements MigrationInterface {
    name = 'MigrationName1724590139245'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`TeamInvites\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`userId\` varchar(255) NOT NULL, \`teamId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Notifications\` ADD \`teamInviteId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`TeamInvites\` ADD CONSTRAINT \`FK_1a22b7dccec7315728a5473d289\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TeamInvites\` ADD CONSTRAINT \`FK_8c09028924aeab47ba24532e5fd\` FOREIGN KEY (\`teamId\`) REFERENCES \`Teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TeamInvites\` DROP FOREIGN KEY \`FK_8c09028924aeab47ba24532e5fd\``);
        await queryRunner.query(`ALTER TABLE \`TeamInvites\` DROP FOREIGN KEY \`FK_1a22b7dccec7315728a5473d289\``);
        await queryRunner.query(`ALTER TABLE \`Notifications\` DROP COLUMN \`teamInviteId\``);
        await queryRunner.query(`DROP TABLE \`TeamInvites\``);
    }

}
