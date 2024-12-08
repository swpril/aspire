import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import { Repository } from './repository.model';

@ObjectType()
@Table
export class RepoVersion extends Model {
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Field()
  @Column
  @ForeignKey(() => Repository)
  public repoId: number;

  @Field()
  @Column({ type: DataTypes.DATE })
  public releaseDate: string;

  @Field()
  @Column
  public version: string;

  @Field()
  @Unique
  @Column
  public versionId: number;

  @Field()
  @Column({ type: DataType.TEXT })
  public body: string;

  @Field()
  public seen: boolean;
}
