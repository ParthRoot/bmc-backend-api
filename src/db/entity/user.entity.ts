import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
} from 'typeorm';
import { RoleEntity, TemplateEntity } from './index';
import { TokenEntity } from './token.entity';
import { SaveTemplateEntity } from './saveTemplate.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index('IDX_UQ_social_id', { unique: true })
    @Column({ type: 'varchar', nullable: true })
    social_id!: string;

    @Index('IDX_UQ_user_email', { unique: true })
    @Column({ type: 'varchar', length: 300, nullable: true })
    email!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    name!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    user_name!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    password_hash!: string;

    @OneToMany(() => RoleEntity, (role) => role.user, {
        cascade: true
    })
    role!: RoleEntity[];

    @OneToMany(() => SaveTemplateEntity, (save_template) => save_template.user, {
        cascade: true
    })
    save_template!: SaveTemplateEntity[];

    @OneToMany(() => TokenEntity, (token) => token.user, {
        cascade: true
    })
    token!: TokenEntity[];

    @Column({ type: 'boolean', default: true })
    is_active!: boolean;

    @Column({ type: 'boolean', default: false })
    is_verified!: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;

    @DeleteDateColumn()
    delete_at!: Date;

    @Column({ type: 'varchar', length: 300, nullable: true, default: null })
    avatar!: string;
}
