import dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';

import {
  RepoVersion,
  Repository,
  User,
  UserRepo,
  UserRepoVersions,
} from '../models';
dotenv.config();

const hostname = process.env.DB_HOST;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DATABASE_NAME;
const dialect = 'postgres';

const sequelize = new Sequelize(database, username, password, {
  host: hostname,
  dialect,
  define: {
    timestamps: false,
  },
  models: [Repository, User, UserRepo, UserRepoVersions, RepoVersion],
});

export default sequelize;
