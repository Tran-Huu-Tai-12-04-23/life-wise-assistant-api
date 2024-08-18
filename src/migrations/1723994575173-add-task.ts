import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1723994575173 implements MigrationInterface {
    name = 'MigrationName1723994575173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`SubTasks\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`taskId\` varchar(255) NOT NULL, \`isChecked\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`TaskComment\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`content\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`taskId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`TaskHistory\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`description\` varchar(10000) NOT NULL, \`taskId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`SubTasks\` ADD CONSTRAINT \`FK_a4877d69c91fc8e442d28aec28e\` FOREIGN KEY (\`taskId\`) REFERENCES \`Tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TaskComment\` ADD CONSTRAINT \`FK_5239101dd6905b80bd59e2d412a\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TaskComment\` ADD CONSTRAINT \`FK_44b50c052585d001e0a5cf90baf\` FOREIGN KEY (\`taskId\`) REFERENCES \`Tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`TaskHistory\` ADD CONSTRAINT \`FK_0d42c840a529301aa32e9ba7765\` FOREIGN KEY (\`taskId\`) REFERENCES \`Tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`TaskHistory\` DROP FOREIGN KEY \`FK_0d42c840a529301aa32e9ba7765\``);
        await queryRunner.query(`ALTER TABLE \`TaskComment\` DROP FOREIGN KEY \`FK_44b50c052585d001e0a5cf90baf\``);
        await queryRunner.query(`ALTER TABLE \`TaskComment\` DROP FOREIGN KEY \`FK_5239101dd6905b80bd59e2d412a\``);
        await queryRunner.query(`ALTER TABLE \`SubTasks\` DROP FOREIGN KEY \`FK_a4877d69c91fc8e442d28aec28e\``);
        await queryRunner.query(`DROP TABLE \`TaskHistory\``);
        await queryRunner.query(`DROP TABLE \`TaskComment\``);
        await queryRunner.query(`DROP TABLE \`SubTasks\``);
    }

}
