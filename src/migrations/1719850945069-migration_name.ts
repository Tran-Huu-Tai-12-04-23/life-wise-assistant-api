import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1719850945069 implements MigrationInterface {
    name = 'MigrationName1719850945069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`UserDetails\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Columns\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`Teams\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Teams\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Columns\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` CHANGE \`createdBy\` \`createdBy\` varchar(36) NOT NULL`);
    }

}
