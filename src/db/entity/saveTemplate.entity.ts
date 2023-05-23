import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TemplateEntity } from './template.entity';

@Entity('save_template')
export class SaveTemplateEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text', nullable: true })
    value!: string;

    @Column({ type: 'boolean', default: true })
    is_current_version!: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @Column({ type: 'boolean', default: false })
    is_deleted!: boolean;

    @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    @JoinTable()
    user!: UserEntity;


    @ManyToOne(() => TemplateEntity, (template) => template.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'template_id' })
    @JoinTable()
    template!: TemplateEntity;
}
