import {
  AutoIncrement,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import { RepoVersion } from './repo-version.model';

@ObjectType()
@Table
export class Repository extends Model {
  @Field()
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Field()
  @Unique
  @Column
  public url: string;

  @Field()
  @Column
  public name: string;

  @Field()
  @Column
  public description: string;

  @Field()
  public seen: boolean;

  @Field(() => [RepoVersion])
  @HasMany(() => RepoVersion)
  public releases: RepoVersion;
}
