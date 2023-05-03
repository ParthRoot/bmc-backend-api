import {
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RoleAvailableEntity, UserEntity } from './index';

@Entity('role')
export class RoleEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id!: bigint;

    @ManyToOne(() => UserEntity, (user) => user.id, { cascade: true })
    @JoinColumn({ name: 'user_id' })
    @JoinTable()
    user!: UserEntity;

    @ManyToOne(() => RoleAvailableEntity, (role) => role.id)
    @JoinColumn({ name: 'role_id' })
    role!: RoleAvailableEntity;

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

    @Column({ type: 'varchar', length: 300, nullable: true })
    updated_by!: string | null;

    @Column({ type: 'varchar', length: 300, nullable: true })
    internal_comment!: string | null;
}
