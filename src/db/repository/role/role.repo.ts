import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from '../..';
import { RoleEntity } from 'src/db/entity';

@Injectable()
export class RoleRepository extends Repository<RoleEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {
        super(RoleEntity, dataSource.createEntityManager());
    }
}