import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, ObjectType } from 'type-graphql';
import { RepoVersion } from './repo-version.model';
import { User } from './user.model';

@ObjectType()
@Table
export class UserRepoVersions extends Model {
  @Field()
  @ForeignKey(() => User)
  @Column
  public userId: number;

  @Field()
  @ForeignKey(() => RepoVersion)
  @Column
  public repoVersionId: number;

  @Field()
  @BelongsTo(() => RepoVersion)
  public repoVersion: RepoVersion;
}
