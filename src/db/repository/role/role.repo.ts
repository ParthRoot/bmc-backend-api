import { RoleEntity, UserEntity } from '../../entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../..';

export class RoleAvaialbleError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class RoleRepositoryError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

@Injectable()
export class RoleRepository extends Repository<RoleEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {

        super(RoleEntity, dataSource.createEntityManager());
        // console.log(this.connection.query(`SELECT DATABASE()`));
    }
}