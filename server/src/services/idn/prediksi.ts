import axios from 'axios';
import { load } from 'cheerio';
import getDetail from './get-detail';
import { common_headers } from './utils/common-headers';

interface GetPrediksiResultParams {
  angka_prediksi: string[];
  periode: number;
  kode_pasaran: string;
  PHPSESSID: string;
  baseURL: string;
}

const get_prediksi_result = async ({
  angka_prediksi,
  periode,
  kode_pasaran,
  PHPSESSID,
  baseURL,
}: GetPrediksiResultParams) => {
  const response6 = await axios.post(
    `${baseURL}/admin_prediksifullbb.php?psr=p${kode_pasaran}`,
    `periode=${periode}&nomor=${angka_prediksi[0]}&nomor1=${angka_prediksi[1]}&nomor2=${angka_prediksi[2]}&submit=Submit&sar=p${kode_pasaran}`,
    {
      headers: {
        ...common_headers({ phpsessid: PHPSESSID }),
        'content-type': 'application/x-www-form-urlencoded',
        'sec-fetch-dest': 'frame',
        'sec-fetch-user': '?1',
        Referer: `${baseURL}/admin_prediksifullbb.php?psr=p${kode_pasaran}`,
      },
    }
  );

  const ch2 = load(response6.data);
  const detail = await getDetail(response6.data);
  return {
    angka_prediksi_1: angka_prediksi[0],
    angka_prediksi_2: angka_prediksi[1],
    angka_prediksi_3: angka_prediksi[2],
    hasil: ch2('b').last().text(),
    detail,
  };
};

export default get_prediksi_result;
