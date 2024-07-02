import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1719878030710 implements MigrationInterface {
    name = 'MigrationName1719878030710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`teams_users_users\` (\`teamsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_bcc51071c2035715f911d584bb\` (\`teamsId\`), INDEX \`IDX_1eadce14c439c82359363d7dbd\` (\`usersId\`), PRIMARY KEY (\`teamsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`teams_users_users\` ADD CONSTRAINT \`FK_bcc51071c2035715f911d584bbf\` FOREIGN KEY (\`teamsId\`) REFERENCES \`Teams\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`teams_users_users\` ADD CONSTRAINT \`FK_1eadce14c439c82359363d7dbd7\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teams_users_users\` DROP FOREIGN KEY \`FK_1eadce14c439c82359363d7dbd7\``);
        await queryRunner.query(`ALTER TABLE \`teams_users_users\` DROP FOREIGN KEY \`FK_bcc51071c2035715f911d584bbf\``);
        await queryRunner.query(`DROP INDEX \`IDX_1eadce14c439c82359363d7dbd\` ON \`teams_users_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_bcc51071c2035715f911d584bb\` ON \`teams_users_users\``);
        await queryRunner.query(`DROP TABLE \`teams_users_users\``);
    }

}
