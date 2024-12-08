import { ApolloServerErrorCode } from '@apollo/server/errors';
import { DEFAULT_USER_ID, GITHUB_REPO_URL_REGEX } from '@shared/constants';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import sequelize from '../config/db.config';
import BadRequestException from '../exceptions/BadRequestException';
import { gitAxios } from '../github-api';
import { RepoVersion, Repository, UserRepo, UserRepoVersions } from '../models';
import { getUsernameAndRepo } from '../util/github';
import { handleErrors } from '../util/handlers.util';

@Resolver(() => Repository)
export class RepositoryResolver {
  @Query(() => [Repository])
  async repositories(@Arg('userId') userId: number): Promise<Repository[]> {
    try {
      const userRepos = await UserRepo.findAll({
        where: { userId },
        include: [
          {
            model: Repository,
          },
        ],
      });

      return userRepos.map((userRepo) => userRepo.repo);
    } catch (error) {
      handleErrors(error);
    }
  }

  @Mutation(() => Boolean)
  async createRepo(@Arg('url') url: string): Promise<boolean> {
    if (!GITHUB_REPO_URL_REGEX.test(url)) {
      throw new BadRequestException(
        'Invalid github url',
        ApolloServerErrorCode.BAD_REQUEST
      );
    }

    try {
      const repo = await Repository.findOne({ where: { url } });
      if (repo) {
        const existed = await UserRepo.findOne({
          where: { userId: DEFAULT_USER_ID, repoId: repo.dataValues.id },
        });
        if (existed) {
          return true;
        }
        await UserRepo.create({
          userId: DEFAULT_USER_ID,
          repoId: repo.dataValues.id,
        });
        return true;
      }
    } catch (errors) {
      handleErrors(errors);
    }

    try {
      const { repo, username } = getUsernameAndRepo(url);
      const releases = await gitAxios
        .get(`/repos/${username}/${repo}/releases`)
        .then((res) => res.data);

      const repoResponse = await gitAxios.get(`/repos/${username}/${repo}`);
      const createdRepo = await sequelize.transaction((transaction) =>
        Repository.create(
          {
            url,
            name: repo,
            description: repoResponse.data.description,
          },
          { transaction }
        )
      );
      const releaseData = releases.map((release) => ({
        versionId: release.id,
        version: release.tag_name,
        repoId: createdRepo.dataValues.id,
        releaseDate: release.published_at,
        body: release.body,
      }));

      await sequelize.transaction((transaction) =>
        Promise.all([
          RepoVersion.bulkCreate(releaseData, { transaction }),
          UserRepo.create(
            { userId: DEFAULT_USER_ID, repoId: createdRepo.dataValues.id },
            { transaction }
          ),
        ])
      );

      return true;
    } catch (error) {
      handleErrors(error);
    }
  }

  @Mutation(() => Boolean)
  async refetchReleases(@Arg('repoId') repoId: number) {
    try {
      const repo = await Repository.findOne({
        where: {
          id: repoId,
        },
      });
      const { username, repo: name } = getUsernameAndRepo(repo.dataValues.url);

      const releases = await gitAxios
        .get(`/repos/${username}/${name}/releases`)
        .then((res) => res.data);

      const releaseData = releases.map((release) => ({
        versionId: release.id,
        version: release.tag_name,
        repoId,
        releaseDate: release.published_at,
      }));

      await sequelize.transaction((transaction) =>
        Promise.all(
          releaseData.map((data) => RepoVersion.upsert(data, { transaction }))
        )
      );

      return true;
    } catch (errors) {
      handleErrors(errors);
    }
  }

  @Mutation(() => Boolean)
  async markSeen(
    @Arg('userId') userId: number,
    @Arg('repoVersionId') repoVersionId: number
  ) {
    try {
      await UserRepoVersions.create({
        userId,
        repoVersionId,
      });

      return true;
    } catch (errors) {
      handleErrors(errors);
    }
    return false;
  }

  @Query(() => [RepoVersion])
  async getReleases(@Arg('repoId') repoId: number) {
    try {
      const [releases, userRepos] = await Promise.all([
        RepoVersion.findAll({
          where: { repoId },
          attributes: [
            'id',
            'repoId',
            'version',
            'versionId',
            'releaseDate',
            'body',
          ],
          order: [['releaseDate', 'DESC']],
        }),
        UserRepoVersions.findAll({
          where: { userId: DEFAULT_USER_ID },
        }),
      ]);

      const userRepoVersionsIds = userRepos
        .map((userRepoVersion) => userRepoVersion.dataValues)
        .map((item) => item.repoVersionId);

      return releases.map((release) => ({
        ...release.dataValues,
        seen: userRepoVersionsIds.includes(release.dataValues.id),
      }));
    } catch (errors) {
      handleErrors(errors);
    }
  }
}
