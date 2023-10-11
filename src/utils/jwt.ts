import jwt, {SignOptions} from 'jsonwebtoken';
import {readFileSync} from 'fs';

export const signJwt = (
    payload: Object,
    options: SignOptions
) => {
    try {
        const privateKey = readFileSync('./jwtRS256.key', 'utf-8');

        return jwt.sign(payload, privateKey, {
            ...(options && options),
            algorithm: 'RS256',
        });
    } catch (error) {
        console.log('Generate jwtRS256 key: `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key`')
        return null;
    }
};

export const verifyJwt = <T>(
    token: string,
): T | null => {
    try {
        const publicKey = readFileSync('./jwtRS256.key', 'utf-8');

        const decoded = jwt.verify(token, publicKey) as T;

        return decoded;
    } catch (error) {
        console.log('Generate jwtRS256 key: `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key`')
        return null;
    }
};
