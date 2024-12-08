import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import { Repository } from './repository.model';
import { User } from './user.model';

@ObjectType()
@Table
export class UserRepo extends Model {
  @Field()
  @ForeignKey(() => User)
  @Column
  public userId: number;

  @Field()
  @BelongsTo(() => User)
  public user: User;

  @Field()
  @ForeignKey(() => Repository)
  @Column
  public repoId: number;

  @Field()
  @BelongsTo(() => Repository)
  public repo: Repository;
}
