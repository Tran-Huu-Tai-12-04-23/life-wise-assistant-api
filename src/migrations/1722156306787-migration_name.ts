// import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1722156306787 implements MigrationInterface {
    name = 'MigrationName1722156306787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Messages\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`content\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`ownerId\` varchar(36) NULL, \`groupChatId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`GroupChats\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`type\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT 0, \`ownerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Notifications\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`description\` varchar(10000) NOT NULL, \`type\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Teams\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`thumbnails\` varchar(255) NOT NULL, \`description\` varchar(500) NOT NULL, \`tags\` varchar(255) NOT NULL, \`isWorkPlace\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Columns\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`totalTask\` int NOT NULL DEFAULT '0', \`statusCode\` varchar(255) NOT NULL, \`index\` int NOT NULL, \`teamId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Tasks\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`description\` varchar(10000) NOT NULL, \`dateExpire\` datetime NOT NULL, \`priority\` varchar(255) NOT NULL DEFAULT 'MEDIUM', \`type\` varchar(255) NOT NULL DEFAULT 'TASK', \`status\` varchar(255) NOT NULL DEFAULT 'TO_ASSIGN', \`fileLink\` varchar(255) NOT NULL DEFAULT '', \`cmdCheckOutBranch\` varchar(255) NOT NULL DEFAULT '', \`cmdCommit\` varchar(255) NOT NULL DEFAULT '', \`sourceCodeLink\` varchar(255) NOT NULL DEFAULT '', \`index\` int NOT NULL, \`columnId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Users\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`username\` varchar(500) NOT NULL, \`password\` varchar(500) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`verifyAt\` datetime NOT NULL, \`isActive\` tinyint NOT NULL, \`role\` varchar(255) NOT NULL DEFAULT 'MEMBER', \`notificationsId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`UserDetails\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`fullName\` varchar(500) NOT NULL, \`address\` varchar(500) NOT NULL, \`phoneNumber\` varchar(500) NOT NULL, \`email\` varchar(500) NOT NULL, \`githubLink\` varchar(500) NOT NULL, \`telegramLink\` varchar(500) NOT NULL, \`facebookLink\` varchar(500) NOT NULL, \`bio\` varchar(500) NOT NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_e60e37fdce8f5e2b289b621433\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`History\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`type\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`targetActionId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`group_chats_lst_member_users\` (\`groupChatsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_dbc50c72ec9266ae6915dec3ef\` (\`groupChatsId\`), INDEX \`IDX_471b458ddb62fa0893836384e7\` (\`usersId\`), PRIMARY KEY (\`groupChatsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`teams_members_users\` (\`teamsId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_7669600fb5620861e64df6be12\` (\`teamsId\`), INDEX \`IDX_309874039d297b30d077d16ae7\` (\`usersId\`), PRIMARY KEY (\`teamsId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks_lst_person_in_charge_users\` (\`tasksId\` varchar(36) NOT NULL, \`usersId\` varchar(36) NOT NULL, INDEX \`IDX_0f475a899d5df704673af6babd\` (\`tasksId\`), INDEX \`IDX_29d524b35d36a3fe49dbe1659c\` (\`usersId\`), PRIMARY KEY (\`tasksId\`, \`usersId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_b12fd5b5c9a4672bb2a88ffbb75\` FOREIGN KEY (\`ownerId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Messages\` ADD CONSTRAINT \`FK_dfc9935de6cca24502aac8746da\` FOREIGN KEY (\`groupChatId\`) REFERENCES \`GroupChats\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`GroupChats\` ADD CONSTRAINT \`FK_dff62ff87204092b62397f135b8\` FOREIGN KEY (\`ownerId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Columns\` ADD CONSTRAINT \`FK_9c700ed4dadba75da1ef003caef\` FOREIGN KEY (\`teamId\`) REFERENCES \`Teams\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Tasks\` ADD CONSTRAINT \`FK_150fedd2a3f5f9a9ad2b4612387\` FOREIGN KEY (\`columnId\`) REFERENCES \`Columns\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD CONSTRAINT \`FK_b2c7e0202f52d3ff6cc4c505813\` FOREIGN KEY (\`notificationsId\`) REFERENCES \`Notifications\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` ADD CONSTRAINT \`FK_e60e37fdce8f5e2b289b621433f\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` ADD CONSTRAINT \`FK_dbc50c72ec9266ae6915dec3ef4\` FOREIGN KEY (\`groupChatsId\`) REFERENCES \`GroupChats\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` ADD CONSTRAINT \`FK_471b458ddb62fa0893836384e7f\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` ADD CONSTRAINT \`FK_7669600fb5620861e64df6be125\` FOREIGN KEY (\`teamsId\`) REFERENCES \`Teams\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` ADD CONSTRAINT \`FK_309874039d297b30d077d16ae76\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks_lst_person_in_charge_users\` ADD CONSTRAINT \`FK_0f475a899d5df704673af6babdb\` FOREIGN KEY (\`tasksId\`) REFERENCES \`Tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`tasks_lst_person_in_charge_users\` ADD CONSTRAINT \`FK_29d524b35d36a3fe49dbe1659cb\` FOREIGN KEY (\`usersId\`) REFERENCES \`Users\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks_lst_person_in_charge_users\` DROP FOREIGN KEY \`FK_29d524b35d36a3fe49dbe1659cb\``);
        await queryRunner.query(`ALTER TABLE \`tasks_lst_person_in_charge_users\` DROP FOREIGN KEY \`FK_0f475a899d5df704673af6babdb\``);
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` DROP FOREIGN KEY \`FK_309874039d297b30d077d16ae76\``);
        await queryRunner.query(`ALTER TABLE \`teams_members_users\` DROP FOREIGN KEY \`FK_7669600fb5620861e64df6be125\``);
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` DROP FOREIGN KEY \`FK_471b458ddb62fa0893836384e7f\``);
        await queryRunner.query(`ALTER TABLE \`group_chats_lst_member_users\` DROP FOREIGN KEY \`FK_dbc50c72ec9266ae6915dec3ef4\``);
        await queryRunner.query(`ALTER TABLE \`UserDetails\` DROP FOREIGN KEY \`FK_e60e37fdce8f5e2b289b621433f\``);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP FOREIGN KEY \`FK_b2c7e0202f52d3ff6cc4c505813\``);
        await queryRunner.query(`ALTER TABLE \`Tasks\` DROP FOREIGN KEY \`FK_150fedd2a3f5f9a9ad2b4612387\``);
        await queryRunner.query(`ALTER TABLE \`Columns\` DROP FOREIGN KEY \`FK_9c700ed4dadba75da1ef003caef\``);
        await queryRunner.query(`ALTER TABLE \`GroupChats\` DROP FOREIGN KEY \`FK_dff62ff87204092b62397f135b8\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_dfc9935de6cca24502aac8746da\``);
        await queryRunner.query(`ALTER TABLE \`Messages\` DROP FOREIGN KEY \`FK_b12fd5b5c9a4672bb2a88ffbb75\``);
        await queryRunner.query(`DROP INDEX \`IDX_29d524b35d36a3fe49dbe1659c\` ON \`tasks_lst_person_in_charge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_0f475a899d5df704673af6babd\` ON \`tasks_lst_person_in_charge_users\``);
        await queryRunner.query(`DROP TABLE \`tasks_lst_person_in_charge_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_309874039d297b30d077d16ae7\` ON \`teams_members_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_7669600fb5620861e64df6be12\` ON \`teams_members_users\``);
        await queryRunner.query(`DROP TABLE \`teams_members_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_471b458ddb62fa0893836384e7\` ON \`group_chats_lst_member_users\``);
        await queryRunner.query(`DROP INDEX \`IDX_dbc50c72ec9266ae6915dec3ef\` ON \`group_chats_lst_member_users\``);
        await queryRunner.query(`DROP TABLE \`group_chats_lst_member_users\``);
        await queryRunner.query(`DROP TABLE \`History\``);
        await queryRunner.query(`DROP INDEX \`REL_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\``);
        await queryRunner.query(`DROP TABLE \`UserDetails\``);
        await queryRunner.query(`DROP TABLE \`Users\``);
        await queryRunner.query(`DROP TABLE \`Tasks\``);
        await queryRunner.query(`DROP TABLE \`Columns\``);
        await queryRunner.query(`DROP TABLE \`Teams\``);
        await queryRunner.query(`DROP TABLE \`Notifications\``);
        await queryRunner.query(`DROP TABLE \`GroupChats\``);
        await queryRunner.query(`DROP TABLE \`Messages\``);
    }

// }
