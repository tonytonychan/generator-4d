import axios from 'axios';
import { load } from 'cheerio';
import { common_headers } from './utils/common-headers';

interface GetLastPeriodeParams {
  kode_pasaran: string;
  PHPSESSID: string;
  base_URL: string;
}

const get_last_periode = async ({
  kode_pasaran,
  PHPSESSID,
  base_URL,
}: GetLastPeriodeParams) => {
  const response5 = await axios(
    `${base_URL}/admin_prediksifullbb.php?psr=p${kode_pasaran}`,
    {
      headers: {
        ...common_headers({ phpsessid: PHPSESSID }),
        'sec-fetch-dest': 'frame',
        'sec-fetch-user': '?1',
        Referer: `${base_URL}/agent_bt.php`,
      },
    }
  );

  const ch1 = load(response5.data);
  let last_periode = +ch1('input').first().val()!;
  return last_periode;
};

export default get_last_periode;
