import { Report } from 'src/report/report.entity';

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true }) // will be fixed in the future
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
