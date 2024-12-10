import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { statusCodes } from './config/const.config';
import sequelize from './config/db.config';
import { RepositoryResolver, UserResolver } from './resolvers';

dotenv.config();

async function main() {
  const schema = await buildSchema({
    resolvers: [RepositoryResolver, UserResolver],
    emitSchemaFile: true,
    validate: false,
  });

  const server = new ApolloServer({
    schema,
    formatError: (error: any) => {
      return {
        status: error.extensions.status
          ? error.extensions.status
          : statusCodes.SERVER_ERROR,
        message: error.message,
        code: error.extensions.code || 'INTERNAL_SERVER_ERROR',
        path: error.path,
      };
    },
  });

  await server.start();

  await sequelize.sync();
  // await sequelize.sync({ force: true });

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  await new Promise<void>((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`Server ready at http://localhost:4000`);
}

main();
