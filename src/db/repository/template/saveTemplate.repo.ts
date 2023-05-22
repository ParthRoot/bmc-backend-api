import { AppDataSource } from '../..';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SaveTemplateEntity } from 'src/db/entity/saveTemplate.entity';

export class SaveTemplateError extends Error {
    constructor(message: string) {
        super(message);
    }
}

@Injectable()
export class SaveTemplateRepository extends Repository<SaveTemplateEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {
        super(SaveTemplateEntity, dataSource.createEntityManager());
    }
}