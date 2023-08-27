import { randomChalk } from 'ody-utils';
import { login } from './login';

let token_meta_data: {
  [k: string]: { token: string; last_login: number | null };
} = {};

interface GetPHPSESSIDParams {
  username: string;
  password: string;
  pin: string;
  base_url: string;
}

const get_phpsessid = async ({
  username,
  password,
  pin,
  base_url,
}: GetPHPSESSIDParams) => {
  randomChalk(`Getting PHPSESSID for website ${username}...`);
  const meta = token_meta_data[username];

  if (
    !meta ||
    !meta.token ||
    (meta.last_login && new Date().getTime() - meta.last_login > 60 * 60 * 1000)
  ) {
    const { phpsessid } = await login({
      username,
      password,
      pin,
      base_url,
    });

    if (token_meta_data[username]) {
      token_meta_data[username].token = phpsessid;
      token_meta_data[username].last_login = new Date().getTime();
    } else {
      token_meta_data[username] = {
        token: phpsessid,
        last_login: new Date().getTime(),
      };
    }
  }

  return { phpsessid: token_meta_data[username].token };
};

const reset_data = () => {
  token_meta_data = {};
};

export { get_phpsessid, reset_data };
