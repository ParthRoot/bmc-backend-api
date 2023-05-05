import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddColumn1683263659259 implements MigrationInterface {
    name = 'UserAddColumn1683263659259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
    }

}
