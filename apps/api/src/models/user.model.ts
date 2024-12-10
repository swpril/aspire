import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Table
export class User extends Model {
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Field()
  @Unique
  @Column
  public username: string;
}

@ObjectType()
export class UserType {
  @Field()
  public jwtToken: string;

  @Field()
  public id: number;

  @Field()
  public username: string;
}
