import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../..';
import { TokenEntity } from 'src/db/entity/token.entity';

@Injectable()
export class TokenRepository extends Repository<TokenEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {
        super(TokenEntity, dataSource.createEntityManager());
    }
}