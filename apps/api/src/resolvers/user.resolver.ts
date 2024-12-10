import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { User, UserType } from '../models/user.model';
import { handleErrors } from '../util/handlers.util';
import { STORAGE_KEYS } from '@shared/constants';

@Resolver(() => User)
export class UserResolver {
  @Query(() => Boolean)
  async verify(@Ctx(STORAGE_KEYS.AUTH) token: string): Promise<boolean> {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return true;
    } catch (error) {
      handleErrors(error);
    }
    return false;
  }

  @Query(() => UserType)
  async verifyUser(@Arg('code') code: string): Promise<UserType> {
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        null,
        {
          params: {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
          },
        }
      );
      const tokenData = response.data;
      const params = new URLSearchParams(tokenData);
      const token = params.get('access_token');

      const user = await axios
        .get('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => res.data);
      await User.upsert({ username: user.login });
      const jwtToken = await jwt.sign(
        { username: user.login },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY,
        }
      );

      const userInfo = await User.findOne({ where: { username: user.login } });

      return {
        jwtToken,
        id: userInfo.dataValues.id,
        username: userInfo.dataValues.username,
      };
    } catch (errors) {
      handleErrors(errors);
    }
  }
}
