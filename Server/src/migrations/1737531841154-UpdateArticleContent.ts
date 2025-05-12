import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateArticleContent1737531841154 implements MigrationInterface {
    name = 'UpdateArticleContent1737531841154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE article MODIFY COLUMN content MEDIUMTEXT NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE article MODIFY COLUMN content TEXT NOT NULL`);
    }
}
