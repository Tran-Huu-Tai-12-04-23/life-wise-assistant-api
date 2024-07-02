import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1719877875895 implements MigrationInterface {
    name = 'MigrationName1719877875895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`taskId\` (\`usersId\` varchar(36) NOT NULL, \`tasksId\` varchar(36) NOT NULL, INDEX \`IDX_3966f2d121c86b7bcabcb77e68\` (\`usersId\`), INDEX \`IDX_9c8cc5f1f84b1a227bc7d36816\` (\`tasksId\`), PRIMARY KEY (\`usersId\`, \`tasksId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`taskId\` ADD CONSTRAINT \`FK_3966f2d121c86b7bcabcb77e682\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`taskId\` ADD CONSTRAINT \`FK_9c8cc5f1f84b1a227bc7d368166\` FOREIGN KEY (\`tasksId\`) REFERENCES \`Tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`taskId\` DROP FOREIGN KEY \`FK_9c8cc5f1f84b1a227bc7d368166\``);
        await queryRunner.query(`ALTER TABLE \`taskId\` DROP FOREIGN KEY \`FK_3966f2d121c86b7bcabcb77e682\``);
        await queryRunner.query(`DROP INDEX \`IDX_9c8cc5f1f84b1a227bc7d36816\` ON \`taskId\``);
        await queryRunner.query(`DROP INDEX \`IDX_3966f2d121c86b7bcabcb77e68\` ON \`taskId\``);
        await queryRunner.query(`DROP TABLE \`taskId\``);
    }

}
