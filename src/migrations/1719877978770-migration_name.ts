import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1719877978770 implements MigrationInterface {
    name = 'MigrationName1719877978770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users_tasks_tasks\` (\`usersId\` varchar(36) NOT NULL, \`tasksId\` varchar(36) NOT NULL, INDEX \`IDX_060a6f2cb3faed322e74cdd227\` (\`usersId\`), INDEX \`IDX_6ec0d2229c7ae5377a6f1f9e9c\` (\`tasksId\`), PRIMARY KEY (\`usersId\`, \`tasksId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users_tasks_tasks\` ADD CONSTRAINT \`FK_060a6f2cb3faed322e74cdd2275\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`users_tasks_tasks\` ADD CONSTRAINT \`FK_6ec0d2229c7ae5377a6f1f9e9cc\` FOREIGN KEY (\`tasksId\`) REFERENCES \`Tasks\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users_tasks_tasks\` DROP FOREIGN KEY \`FK_6ec0d2229c7ae5377a6f1f9e9cc\``);
        await queryRunner.query(`ALTER TABLE \`users_tasks_tasks\` DROP FOREIGN KEY \`FK_060a6f2cb3faed322e74cdd2275\``);
        await queryRunner.query(`DROP INDEX \`IDX_6ec0d2229c7ae5377a6f1f9e9c\` ON \`users_tasks_tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_060a6f2cb3faed322e74cdd227\` ON \`users_tasks_tasks\``);
        await queryRunner.query(`DROP TABLE \`users_tasks_tasks\``);
    }

}
