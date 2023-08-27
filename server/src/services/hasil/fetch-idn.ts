import * as IDN from '../idn';
import getLastPeriode from '../idn/periode';
import getPrediksiResult from '../idn/prediksi';

export type Periode = 'Terakhir' | 'Sebelumnya';

const password = process.env.PASSWORD_IDN;
if (!password) throw new Error(`Process env PASSWORD_IDN not defined...`);

const pin = process.env.PIN_IDN;
if (!pin) throw new Error(`Process env PIN not defined...`);

interface FetchIDNParams {
  angkaPrediksi: number[];
  kodePasaran: string;
  kodeWebsite: string;
  periodeInp: Periode;
  baseURL: string;
}

export const fetchIDN = async ({
  angkaPrediksi,
  kodePasaran,
  kodeWebsite,
  periodeInp,
  baseURL,
}: FetchIDNParams) => {
  const { phpsessid } = await IDN.get_phpsessid({
    username: kodeWebsite,
    password,
    pin,
    base_url: baseURL,
  });

  let last_periode = await getLastPeriode({
    kode_pasaran: kodePasaran,
    PHPSESSID: phpsessid,
    base_URL: baseURL,
  });

  const periode = periodeInp === 'Sebelumnya' ? --last_periode : last_periode;

  const { hasil, detail } = await getPrediksiResult({
    angka_prediksi: angkaPrediksi.map(angka => angka.toString()),
    kode_pasaran: kodePasaran,
    periode,
    PHPSESSID: phpsessid,
    baseURL,
  });
  return { hasil, detail };
};
