import { Arg, Mutation, Resolver } from 'type-graphql';
import { handleErrors } from '../util/handlers.util';
import { User } from '../models/user.model';

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg('username') username: string): Promise<User> {
    try {
      return await User.create({ username });
    } catch (error) {
      handleErrors(error);
    }
  }
}
