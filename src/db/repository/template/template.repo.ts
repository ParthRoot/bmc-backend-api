import { TemplateEntity } from '../../entity';
import { AppDataSource } from '../../';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

export class TemplateAvailableError extends Error {
    constructor(message: string) {
        super(message);
    }
}

@Injectable()
export class TemplateRepository extends Repository<TemplateEntity> {
    protected connection = AppDataSource;
    constructor(protected dataSource: DataSource) {
        super(TemplateEntity, dataSource.createEntityManager());
    }
}
