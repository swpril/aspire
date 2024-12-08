import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Table
export class User extends Model {
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;

  @Field()
  @Column
  public username!: string;
}
