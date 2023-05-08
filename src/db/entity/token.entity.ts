import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './index';

export enum TokenType {
    ChangeEmail = 'changeEmail',
    EmailConfirmation = 'emailConfirmation',
    Invite = 'invite',
    ForgotPassword = 'forgotPassword',
    Sms = 'sms',
}

@Entity('token')
export class TokenEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id!: bigint;

    @Column({ type: 'varchar', nullable: false })
    token!: string;

    @Column({ type: 'enum', enum: TokenType, enumName: 'TokenType', nullable: true })
    token_type!: TokenType;

    @Column({ type: 'integer', nullable: true })
    attempts!: number;

    @CreateDateColumn({ type: 'timestamptz', nullable: false })
    token_generated_date!: Date;

    @CreateDateColumn({ type: 'timestamptz', nullable: false })
    token_expired_date!: Date;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at!: Date;

    @ManyToOne(() => UserEntity, (user) => user.id, { cascade: true })
    @JoinColumn({ name: 'user_id' })
    @JoinTable()
    user!: UserEntity;
}