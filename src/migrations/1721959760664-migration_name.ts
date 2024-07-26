import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1721959760664 implements MigrationInterface {
    name = 'MigrationName1721959760664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`group_chats_lst_member_users\` (\`groupChatsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_dbc50c72ec9266ae6915dec3ef\` (\`groupChatsId\`), INDEX \`IDX_471b458ddb62fa0893836384e7\` (\`usersId\`), PRIMARY KEY (\`groupChatsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` ADD CONSTRAINT \`FK_dbc50c72ec9266ae6915dec3ef4\` FOREIGN KEY (\`groupChatsId\`) REFERENCES \`GroupChats\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` ADD CONSTRAINT \`FK_471b458ddb62fa0893836384e7f\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` DROP FOREIGN KEY \`FK_471b458ddb62fa0893836384e7f\``);
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` DROP FOREIGN KEY \`FK_dbc50c72ec9266ae6915dec3ef4\``);
        await queryRunner.query(`DROP INDEX \`IDX_471b458ddb62fa0893836384e7\` ON \`group_chats_lst_member_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_dbc50c72ec9266ae6915dec3ef\` ON \`group_chats_lst_member_users\``);
        await queryRunner.query(`DROP TABLE \`group_chats_lst_member_users\``);
    }

}
