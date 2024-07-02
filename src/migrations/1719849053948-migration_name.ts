import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1719849053948 implements MigrationInterface {
    name = 'MigrationName1719849053948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\` (\`userId\`)`);
    }

}
