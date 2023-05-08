import { TokenEntity } from '../../entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../..';

export class TokenAvaialbleError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class TokenRepositoryError extends Error {
    constructor(msg: string) {
        super(msg);
    }
}

@Injectable()
export class TokenRepository extends Repository<TokenEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {

        super(TokenEntity, dataSource.createEntityManager());
        // console.log(this.connection.query(`SELECT DATABASE()`));
    }
}