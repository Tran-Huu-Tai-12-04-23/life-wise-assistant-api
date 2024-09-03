import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeamHistory1725164682556 implements MigrationInterface {
    name = 'AddTeamHistory1725164682556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`TeamHistory\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`description\` varchar(10000) NOT NULL, \`teamId\` varchar(255) NOT NULL, \`ownerId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`TeamHistory\` ADD CONSTRAINT \`FK_813571c34f7d00f0a76476a88ca\` FOREIGN KEY (\`teamId\`) REFERENCES \`Teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TeamHistory\` ADD CONSTRAINT \`FK_1d9ebaea1d957783fc2470c328d\` FOREIGN KEY (\`ownerId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TeamHistory\` DROP FOREIGN KEY \`FK_1d9ebaea1d957783fc2470c328d\``);
        await queryRunner.query(`ALTER TABLE \`TeamHistory\` DROP FOREIGN KEY \`FK_813571c34f7d00f0a76476a88ca\``);
        await queryRunner.query(`DROP TABLE \`TeamHistory\``);
    }

}
