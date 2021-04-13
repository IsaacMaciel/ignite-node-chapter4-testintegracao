import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { User } from '../../users/entities/User';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => User, user => user.transfer)
  @JoinColumn({ name: 'sender_id' })
  user: User;

  @Column('uuid')
  sender_id: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
