import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1737532079397 implements MigrationInterface {
    name = 'InitialMigration1737532079397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE article MODIFY COLUMN content MEDIUMTEXT NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE article MODIFY COLUMN content TEXT NOT NULL`);
    }
}
