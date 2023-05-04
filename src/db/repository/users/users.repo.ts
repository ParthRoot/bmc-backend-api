import { UserEntity } from '../../entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../..';

export class UserAvaialbleError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UserRepositoryError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {

        super(UserEntity, dataSource.createEntityManager());
        // console.log(this.connection.query(`SELECT DATABASE()`));
    }
}