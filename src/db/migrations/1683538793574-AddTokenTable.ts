import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokenTable1683538793574 implements MigrationInterface {
    name = 'AddTokenTable1683538793574';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_e3583d40265174efd29754a7c57"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_df46160e6aa79943b83c81e496e"`);
        await queryRunner.query(`CREATE TYPE "public"."TokenType" AS ENUM('changeEmail', 'emailConfirmation', 'invite', 'forgotPassword', 'sms')`);
        await queryRunner.query(`CREATE TABLE "token" ("id" BIGSERIAL NOT NULL, "token" character varying NOT NULL, "token_type" "public"."TokenType", "attempts" integer, "token_generated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "token_expired_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_e3583d40265174efd29754a7c57" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_df46160e6aa79943b83c81e496e" FOREIGN KEY ("role_id") REFERENCES "role_available"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_df46160e6aa79943b83c81e496e"`);
        await queryRunner.query(`ALTER TABLE "role" DROP CONSTRAINT "FK_e3583d40265174efd29754a7c57"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TYPE "public"."TokenType"`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_df46160e6aa79943b83c81e496e" FOREIGN KEY ("role_id") REFERENCES "role_available"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role" ADD CONSTRAINT "FK_e3583d40265174efd29754a7c57" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
