import {
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './index';

export enum TokenType {
  ChangeEmail = 'changeEmail',
  EmailConfirmation = 'emailConfirmation',
  Invite = 'invite',
  ForgotPassword = 'forgotPassword',
  Sms = 'sms',
}

@Entity({ name: 'token' })
export class TokenEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id!: bigint;

  @Column({ type: 'text', nullable: false })
  token!: string;

  @Column({ type: 'integer' })
  attempts: number;

  @Column('enum', { enum: TokenType })
  @Index('IDX_OTP_TYPE')
  token_type!: TokenType;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @JoinTable()
  user!: UserEntity;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  token_generation_date!: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  token_expiration_date!: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;
}
