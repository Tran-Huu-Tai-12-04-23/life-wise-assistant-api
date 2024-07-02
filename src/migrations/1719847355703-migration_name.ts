import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1719847355703 implements MigrationInterface {
    name = 'MigrationName1719847355703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Teams\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`thumbnails\` varchar(255) NOT NULL, \`description\` varchar(500) NOT NULL, \`tags\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Columns\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(10000) NOT NULL, \`dateExpire\` datetime NOT NULL, \`priority\` varchar(255) NOT NULL, \`type\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(500) NOT NULL, \`password\` varchar(500) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`verifyAt\` datetime NOT NULL, \`isActive\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`UserDetails\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullName\` varchar(500) NOT NULL, \`address\` varchar(500) NOT NULL, \`phoneNumber\` varchar(500) NOT NULL, \`email\` varchar(500) NOT NULL, \`githubLink\` varchar(500) NOT NULL, \`telegramLink\` varchar(500) NOT NULL, \`facebookLink\` varchar(500) NOT NULL, \`bio\` varchar(500) NOT NULL, \`userId\` int NULL, UNIQUE INDEX \`REL_e60e37fdce8f5e2b289b621433\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD CONSTRAINT \`FK_e60e37fdce8f5e2b289b621433f\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP FOREIGN KEY \`FK_e60e37fdce8f5e2b289b621433f\``);
        await queryRunner.query(`DROP INDEX \`REL_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\``);
        await queryRunner.query(`DROP TABLE \`UserDetails\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
        await queryRunner.query(`DROP TABLE \`Tasks\``);
        await queryRunner.query(`DROP TABLE \`Columns\``);
        await queryRunner.query(`DROP TABLE \`Teams\``);
    }

}
