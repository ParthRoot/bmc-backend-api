import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTokenTable1683518200534 implements MigrationInterface {
    name = 'AddTokenTable1683518200534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."token_token_type_enum" AS ENUM('changeEmail', 'emailConfirmation', 'invite', 'forgotPassword', 'sms')`);
        await queryRunner.query(`CREATE TABLE "token" ("id" BIGSERIAL NOT NULL, "token" text NOT NULL, "attempts" integer NOT NULL, "token_type" "public"."token_token_type_enum" NOT NULL, "token_generation_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "token_expiration_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_OTP_TYPE" ON "token" ("token_type") `);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_e50ca89d635960fda2ffeb17639" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_e50ca89d635960fda2ffeb17639"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_OTP_TYPE"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TYPE "public"."token_token_type_enum"`);
    }

}
