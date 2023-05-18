import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSocialIdInUser1684386614241 implements MigrationInterface {
    name = 'AddSocialIdInUser1684386614241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "social_id" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_UQ_social_id" ON "users" ("social_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_UQ_social_id"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "social_id"`);
    }

}
