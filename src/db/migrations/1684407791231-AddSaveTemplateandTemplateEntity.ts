import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSaveTemplateandTemplateEntity1684407791231 implements MigrationInterface {
    name = 'AddSaveTemplateandTemplateEntity1684407791231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_UQ_social_id"`);
        await queryRunner.query(`CREATE TABLE "template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(300), "description" character varying(300), "value" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "icon" character varying(300), CONSTRAINT "PK_fbae2ac36bd9b5e1e793b957b7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "save_template" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" text, "is_current_version" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "user_id" uuid, "template_id" uuid, CONSTRAINT "PK_ada26d61360f8e2a34bba8f9cbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "social_id"`);
        await queryRunner.query(`ALTER TABLE "save_template" ADD CONSTRAINT "FK_845a743e1d32b4ee2534bce5bf1" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "save_template" ADD CONSTRAINT "FK_e4fd4759277abcf0417a88183c6" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "save_template" DROP CONSTRAINT "FK_e4fd4759277abcf0417a88183c6"`);
        await queryRunner.query(`ALTER TABLE "save_template" DROP CONSTRAINT "FK_845a743e1d32b4ee2534bce5bf1"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "social_id" character varying`);
        await queryRunner.query(`DROP TABLE "save_template"`);
        await queryRunner.query(`DROP TABLE "template"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_UQ_social_id" ON "users" ("social_id") `);
    }

}
