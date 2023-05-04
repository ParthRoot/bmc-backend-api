import {
    Entity,
    JoinColumn,
    JoinTable,
    ManyToOne,
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

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    updated_at!: Date;
}
