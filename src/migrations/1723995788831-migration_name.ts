import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1723995788831 implements MigrationInterface {
    name = 'MigrationName1723995788831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tasks\` CHANGE \`dateExpire\` \`expireDate\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Tasks\` CHANGE \`expireDate\` \`dateExpire\` datetime NOT NULL`);
    }

}
