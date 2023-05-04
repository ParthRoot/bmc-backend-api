import {
    Column,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('role_available')
export class RoleAvailableEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id!: bigint;

    @Index('IDX_user_role_available', { unique: true })
    @Column({ type: 'varchar', length: 300 })
    name!: string;

    @Column({ type: 'varchar', length: 300, default: null })
    description!: string | null;

    @Column({ type: 'boolean', default: true })
    is_active!: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;
}
