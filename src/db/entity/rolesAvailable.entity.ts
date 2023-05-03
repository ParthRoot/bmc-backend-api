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

    @Column({ type: 'boolean', default: false })
    is_verified!: boolean;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @Column({ type: 'varchar', length: 300, nullable: true })
    created_by!: string | null;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;
}
