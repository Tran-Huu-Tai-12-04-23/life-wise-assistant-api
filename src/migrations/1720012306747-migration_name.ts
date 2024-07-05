import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1720012306747 implements MigrationInterface {
    name = 'MigrationName1720012306747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD \`deleteBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`deleteBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Teams\` ADD \`deleteBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Teams\` ADD \`columnId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Columns\` ADD \`deleteBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Columns\` ADD \`totalTask\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD \`deleteBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD \`cmdCommit\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD \`cmdCheckOutBranch\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD \`sourceCodeLink\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Teams\` ADD CONSTRAINT \`FK_ad2c1c9be34fb3855e23fc8363f\` FOREIGN KEY (\`columnId\`) REFERENCES \`Columns\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Teams\` DROP FOREIGN KEY \`FK_ad2c1c9be34fb3855e23fc8363f\``);
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP COLUMN \`sourceCodeLink\``);
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP COLUMN \`cmdCheckOutBranch\``);
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP COLUMN \`cmdCommit\``);
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP COLUMN \`deleteBy\``);
        await queryRunner.query(`ALTER TABLE \`Columns\` DROP COLUMN \`totalTask\``);
        await queryRunner.query(`ALTER TABLE \`Columns\` DROP COLUMN \`deleteBy\``);
        await queryRunner.query(`ALTER TABLE \`Teams\` DROP COLUMN \`columnId\``);
        await queryRunner.query(`ALTER TABLE \`Teams\` DROP COLUMN \`deleteBy\``);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`deleteBy\``);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP COLUMN \`deleteBy\``);
    }

}
