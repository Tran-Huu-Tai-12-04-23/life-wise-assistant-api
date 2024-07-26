import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1721960660305 implements MigrationInterface {
    name = 'MigrationName1721960660305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`GroupChats\` DROP COLUMN \`socketId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`GroupChats\` ADD \`socketId\` varchar(255) NOT NULL`);
    }

}
