import { EnvMissingError } from './errors';

if (!process.env.CLIENT_URL) throw new EnvMissingError('CLIENT_URL');
