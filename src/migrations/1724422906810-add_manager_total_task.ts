import { MigrationInterface, QueryRunner } from "typeorm";

export class AddManagerTotalTask1724422906810 implements MigrationInterface {
    name = 'AddManagerTotalTask1724422906810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD \`totalComment\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD \`totalTaskFile\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD \`totalSubTask\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP COLUMN \`totalSubTask\``);
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP COLUMN \`totalTaskFile\``);
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP COLUMN \`totalComment\``);
    }

}
