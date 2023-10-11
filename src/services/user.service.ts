import config from 'config';
import {User} from '../entities/user.entity';
import redisClient from '../utils/connectRedis';
import {AppDataSource} from '../utils/data-source';
import {signJwt} from '../utils/jwt';

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
    return await userRepository.save(userRepository.create(input));
};

export const findUserByEmail = async ({email}: { email: string }) => {
    return await userRepository.findOne({
        relations: {
            organizations: true,
        },
        where: { email }
    });
};

export const findUserById = async (userId: number) => {
    return await userRepository.findOne({
        relations: {
            organizations: true,
        },
        where: { id: userId }
    });
};

export const findUser = async (query: Object) => {
    return await userRepository.findOneBy(query);
};
export const signTokens = async (user: User) => {
    // 1. Create Session
    redisClient.set(JSON.stringify(user.id), JSON.stringify(user), {
        EX: config.get<number>('redisCacheExpiresIn') * 60,
    });

    // 2. Create Access and Refresh tokens
    // @ts-ignore
    const access_token = signJwt({sub: user.id}, 'accessTokenPrivateKey', {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    // @ts-ignore
    const refresh_token = signJwt({sub: user.id}, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return {access_token, refresh_token};
};
