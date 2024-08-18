import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1723995023350 implements MigrationInterface {
    name = 'MigrationName1723995023350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`TaskFile\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`fileLink\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`taskId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`TaskFile\` ADD CONSTRAINT \`FK_b0be7cb888917c86795747ca11f\` FOREIGN KEY (\`taskId\`) REFERENCES \`Tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TaskFile\` DROP FOREIGN KEY \`FK_b0be7cb888917c86795747ca11f\``);
        await queryRunner.query(`DROP TABLE \`TaskFile\``);
    }

}
