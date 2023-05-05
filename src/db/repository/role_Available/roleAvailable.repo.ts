import { RoleAvailableEntity, RoleEntity, UserEntity } from '../../entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../..';

export class RoleAvailableAvaialbleError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class RoleAvailableRepositoryError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

@Injectable()
export class RoleAvailableRepository extends Repository<RoleAvailableEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {

        super(RoleAvailableEntity, dataSource.createEntityManager());
        // console.log(this.connection.query(`SELECT DATABASE()`));
    }
}