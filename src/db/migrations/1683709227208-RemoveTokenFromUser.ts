import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTokenFromUser1683709227208 implements MigrationInterface {
    name = 'RemoveTokenFromUser1683709227208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_78fb972135c0107138df5aace6b"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp_expires_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "otp_expires_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" text`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_78fb972135c0107138df5aace6b" UNIQUE ("otp")`);
    }

}
