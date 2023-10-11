import {Column, Entity, OneToMany, ManyToMany, PrimaryGeneratedColumn, JoinTable} from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity';

@Entity('organizations')
export class Organization extends Model {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
  })
  description: string;
  @Column()
  name: string

  // @ManyToMany(() => User, user => user.organizations)
  // users: UserOrganization[]

  // @OneToMany(() => UserOrganization, userOrganization => userOrganization.organization)
  // userOrganizations: UserOrganization[];

  @ManyToMany(() => User, (user) => user.organizations, {
    cascade: true,
  })
  users: User[]
}
