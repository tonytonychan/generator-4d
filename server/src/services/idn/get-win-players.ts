import { DateTime } from 'luxon';
import { WinPlayersGameType } from '../../constants/win-players-game-type';
import { common_headers } from './utils/common-headers';

interface GetWinPlayersParams {
  base_url: string;
  kode_pasaran: string;
  keluaran_1: string;
  keluaran_2: string;
  keluaran_3: string;
  game_type: WinPlayersGameType;
  phpsessid: string;
  periode: string;
}

const get_win_players = async (params: GetWinPlayersParams) => {
  const {
    base_url,
    keluaran_1,
    keluaran_2,
    keluaran_3,
    kode_pasaran,
    game_type,
    phpsessid,
    periode,
  } = params;

  const response = await fetch(
    `${base_url}/admin_menkalahbb.php?pasar=p${kode_pasaran}&tipe=${game_type}&periode=${periode}&nomor=${keluaran_1}&nomor2=${keluaran_2}&nomor3=${keluaran_3}`,

    {
      headers: {
        ...common_headers({ phpsessid }),
        'sec-fetch-dest': 'document',
        'sec-fetch-user': '?1',
      },

      referrerPolicy: 'strict-origin-when-cross-origin',
    }
  );

  const res = await response.text();
  const all_tr = res.split('<tr');
  all_tr.shift();
  all_tr.shift();
  all_tr.pop();

  const win_players: {
    transaction_time: Date;
    player_id: string;
    bet_number: string;
    bet_value: number;
    win_amount: number;
  }[] = [];

  const extra_1 =
    game_type === WinPlayersGameType['2D Depan'] ||
    game_type === WinPlayersGameType['2D Tengah'] ||
    game_type === WinPlayersGameType['2D Belakang'] ||
    game_type === WinPlayersGameType['Colok Bebas 2D'] ||
    game_type === WinPlayersGameType['Macau Shio'] ||
    game_type === WinPlayersGameType['Silang Homo'] ||
    game_type === WinPlayersGameType['Colok Jitu'] ||
    game_type === WinPlayersGameType['Kembang Kempis'] ||
    game_type === WinPlayersGameType['Kombinasi'];

  const extra_2 = game_type === WinPlayersGameType['Colok Naga'];

  for (const tr of all_tr) {
    const all_td = tr.split('<td');

    win_players.push({
      bet_number: all_td[4].split("COLOR='#000000'>")[1].split('</font>')[0],

      bet_value: Number(
        all_td[extra_1 ? 6 : extra_2 ? 7 : 5]
          .split("COLOR='#000000'>")[1]
          .split('</font>')[0]
          .replace(/,/g, '')
      ),

      player_id: all_td[3]
        .split('admin_transaksi.php?namague=')[1]
        .split("'")[0],

      transaction_time: DateTime.fromFormat(
        all_td[2].split("COLOR='#000000'>")[1].split('</font>')[0],
        'dd-MM-yyyy HH:mm:ss'
      ).toJSDate(),

      win_amount: Number(
        all_td[extra_1 ? 9 : extra_2 ? 10 : 8]
          .split("COLOR='#000000'>")[1]
          .split('</font>')[0]
          .replace(/,/g, '')
      ),
    });
  }

  return { win_players };
};

export { get_win_players };
