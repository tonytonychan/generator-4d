import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { NotFoundError } from './errors';
import { current_user, error_handler /* require_auth */ } from './middlewares';
import { router_v1 } from './routes/v1';

const app = express();
const is_production = process.env.NODE_ENV === 'production';

if (!is_production) app.use(morgan('dev'));
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieSession({ signed: false, secure: false }));
app.use(current_user);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use('/api/', router_v1);
app.all('/api/**', () => {
  throw new NotFoundError('route not found');
});

// * Static File Handling
app.use('/images', express.static('./images'));
app.use(express.static('./public/'));

const cb: express.RequestHandler = (_, res) => {
  res.status(200).sendFile('./public/index.html', { root: '.' });
};

app.get('/', cb);
app.get(/.*/, (_, res) => {
  res.status(404).sendFile('./public/index.html', { root: '.' });
});

app.use(error_handler);

export default app;
