import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1725364542094 implements MigrationInterface {
    name = 'MigrationName1725364542094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP FOREIGN KEY \`FK_e60e37fdce8f5e2b289b621433f\``);
        await queryRunner.query(`DROP INDEX \`REL_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\``);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD \`userId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD UNIQUE INDEX \`IDX_e60e37fdce8f5e2b289b621433\` (\`userId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD CONSTRAINT \`FK_e60e37fdce8f5e2b289b621433f\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP FOREIGN KEY \`FK_e60e37fdce8f5e2b289b621433f\``);
        await queryRunner.query(`DROP INDEX \`REL_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\``);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP INDEX \`IDX_e60e37fdce8f5e2b289b621433\``);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\` (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD CONSTRAINT \`FK_e60e37fdce8f5e2b289b621433f\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
