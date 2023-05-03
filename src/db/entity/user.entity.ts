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
import { RoleEntity } from './index';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index('IDX_UQ_user_email', { unique: true })
    @Column({ type: 'varchar', length: 300, nullable: true })
    email!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    name!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    user_name!: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    password_hash!: string;

    @OneToMany(() => RoleEntity, (role) => role.user)
    role!: RoleEntity[];

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

    @Column({
        type: 'text',
        unique: true,
        nullable: true,
    })
    otp!: string | null;

    @Column({ type: 'timestamptz', nullable: true })
    otp_expires_at!: Date | null;

    @Column({ type: 'varchar', length: 300, nullable: true, default: null })
    avatar!: string;

    @Column({ type: 'text', default: null })
    social_id!: string | null;

    @Column({ type: 'varchar', nullable: true })
    device_token!: string;
}
