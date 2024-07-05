import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1720152463589 implements MigrationInterface {
    name = 'MigrationName1720152463589'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`teams_members_users\` (\`teamsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_7669600fb5620861e64df6be12\` (\`teamsId\`), INDEX \`IDX_309874039d297b30d077d16ae7\` (\`usersId\`), PRIMARY KEY (\`teamsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`role\` varchar(255) NOT NULL DEFAULT 'MEMBER'`);
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` ADD CONSTRAINT \`FK_7669600fb5620861e64df6be125\` FOREIGN KEY (\`teamsId\`) REFERENCES \`Teams\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` ADD CONSTRAINT \`FK_309874039d297b30d077d16ae76\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` DROP FOREIGN KEY \`FK_309874039d297b30d077d16ae76\``);
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` DROP FOREIGN KEY \`FK_7669600fb5620861e64df6be125\``);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`role\``);
        await queryRunner.query(`DROP INDEX \`IDX_309874039d297b30d077d16ae7\` ON \`teams_members_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_7669600fb5620861e64df6be12\` ON \`teams_members_users\``);
        await queryRunner.query(`DROP TABLE \`teams_members_users\``);
    }

}
