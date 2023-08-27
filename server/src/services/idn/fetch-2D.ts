import axios from 'axios';
import { DateTime } from 'luxon';
import { randomChalk } from 'ody-utils';
import { BetType } from '../../constants/bet-type';
import { Bet } from '../../models/bet';
import get_last_periode from './periode';
import { common_headers } from './utils/common-headers';

interface FetchBet2dPlayerParams {
  phpsessid: string;
  base_URL: string;
  pasaran: any;
  website: string;
  kode_pasar: string;
}

const fetch_bet_2D_player = async (params: FetchBet2dPlayerParams) => {
  const { base_URL, kode_pasar, phpsessid: PHPSESSID, website, pasaran } = params;
  const array_check: any = [];

  const periode = await get_last_periode({
    kode_pasaran: kode_pasar,
    PHPSESSID,
    base_URL,
  });

  let start = 0;
  let end = 50;
  let page = 1;
  let berhasil = true;

  while (berhasil) {
    randomChalk(
      `Fetching data bet 2D di pasaran ${pasaran} di ${website} page ke ${page}`
    );

    const has_new_data = [];

    await axios<string>(`${base_URL}/admin_invoice13.php?psr=p${kode_pasar}`, {
      headers: {
        ...common_headers({ phpsessid: PHPSESSID }),
        'sec-fetch-dest': 'frame',
        'sec-fetch-user': '?1',
        Referer: `${base_URL}/agent_bt.php`,
      },
    });

    const response = await axios<string>(
      `${base_URL}/admin_invoice_frame.php?tombol=2D&start=${start}&by=&end=${end}&s_user=&s_nomor=&s_periode=${periode}&pos2d=C&dist=&bet=&tanggalnya=&usernya=&tebakan=`,

      {
        headers: {
          ...common_headers({ phpsessid: PHPSESSID }),
          'sec-fetch-dest': 'frame',
          'sec-fetch-user': '?1',
          Referer: `${base_URL}/admin_invoice13.php?psr=p${kode_pasar}`,
        },
      }
    );

    const bet_player_raw_string = response.data
      ?.split('Reff')[1]
      ?.split('<tr bgcolor=#FFCC99>')[0];

    const bet_player_raw = bet_player_raw_string.split('<tr bgcolor=');

    bet_player_raw.shift();
    bet_player_raw.pop();

    if (bet_player_raw.length === 51) bet_player_raw.pop();

    for (const data of bet_player_raw) {
      const d = data.split('</td>');

      const bet_type = BetType.TwoD;
      const periode_data = +d[3].split("verdana'>")[1].split('<')[0];

      const bet_number = +d[7]
        .split("verdana'>")[1]
        .split('<')[0]
        .replaceAll('&nbsp;', '');

      const bet_value = +d[9]
        .split("verdana'>")[1]
        .split('<')[0]
        .replaceAll(',', '');

      const invoice = d[4].split("verdana'>")[1].split('<')[0];
      const bet_time = d[5].split("verdana'>")[1].split('<')[0];
      const player_id = d[6].split("verdana'>")[1].split('<')[0];
      const win_multiplier = +d[13].split("verdana'>")[1].split('<')[0];
      const player_win = bet_value * win_multiplier;

      has_new_data.push(invoice);

      array_check.push({
        website,
        pasaran,
        periode: periode_data,
        bet_number,
        bet_value,
        bet_type,
        invoice,

        bet_time: DateTime.fromFormat(
          bet_time,
          'yyyy-MM-dd HH:mm:ss'
        ).toJSDate(),

        player_id,
        win_multiplier,
        player_win,
      });
    }

    berhasil = has_new_data.length > 0 ? true : false;
    start += 50;
    end += 50;
    page++;
  }

  if (!array_check.length) return;
  const saved_data = await Bet.find({ website, periode });
  const existing_invoices = new Set(saved_data.map(item => item.invoice));

  array_check.forEach(async (data: any) => {
    if (!existing_invoices.has(data.invoice)) {
      const new_bet_data = Bet.build({
        website: website,
        pasaran: data.pasaran,
        periode: data.periode,
        bet_number: data.bet_number,
        bet_value: data.bet_value,
        bet_type: data.bet_type,
        invoice: data.invoice,
        bet_time: data.bet_time,
        player_id: data.player_id,
        win_multiplier: data.win_multiplier,
        player_win: data.player_win,
      });

      await new_bet_data.save();
    }
  });

  return;
};

export { fetch_bet_2D_player };
