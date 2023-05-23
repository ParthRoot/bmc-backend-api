import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { SaveTemplateEntity } from './saveTemplate.entity';

@Entity('template')
export class TemplateEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    name!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    description!: string;

    @Column({ type: 'text', nullable: true })
    value!: string;

    @Column({ type: 'boolean', default: true })
    is_active!: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @Column({ type: 'varchar', length: 300, nullable: true, default: null })
    icon!: string;

    @OneToMany(() => SaveTemplateEntity, (save_template) => save_template.template, {
        cascade: true
    })
    save_template!: SaveTemplateEntity[];

}
