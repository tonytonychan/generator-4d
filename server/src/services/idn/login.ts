import axios from 'axios';
import { randomChalk } from 'ody-utils';
import hash_to_md5 from '../../utils/string-to-md5';
import { common_headers } from './utils/common-headers';

interface LoginParams {
  username: string;
  password: string;
  pin: string;
  base_url: string;
}

const login = async ({ username, password, pin, base_url }: LoginParams) => {
  randomChalk(`login to ${base_url} for username ${username}`);

  const get_cookie_response = await axios(`${base_url}/index.php`, {
    withCredentials: true,
  });

  const phpsessid = get_cookie_response.headers['set-cookie']
    ?.filter(cookie => cookie.includes('PHPSESSID'))[0]
    .split(';')[0]
    .split('=')[1];

  if (!phpsessid) throw new Error(`Gagal mengambil PHPSESSID...`);
  const hashed_password = hash_to_md5(password);

  await axios.post(
    `${base_url}/index.php`,
    `entered_login=${username}&entered_password=&vb_login_md5password=${hashed_password}&vb_login_md5password_utf=${hashed_password}`,

    {
      headers: {
        ...common_headers({ phpsessid }),
        'content-type': 'application/x-www-form-urlencoded',
        'sec-fetch-dest': 'document',
        'sec-fetch-user': '?1',
        Referer: `${base_url}/index.php`,
      },
    }
  );

  // * INPUT PIN
  await axios.post(`${base_url}/index.php`, `pin=${pin}&input_pin=Submit`, {
    headers: {
      ...common_headers({ phpsessid }),
      'content-type': 'application/x-www-form-urlencoded',
      'sec-fetch-dest': 'document',
      'sec-fetch-user': '?1',
      Referer: `${base_url}/index.php`,
    },
  });

  return { phpsessid };
};

export { login };
