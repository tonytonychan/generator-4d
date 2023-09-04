import axios from 'axios'
import { randomChalk } from 'ody-utils'
import get_last_periode from './periode'
import { common_headers } from './utils/common-headers'
import Semalam from '../../models/semalam'

interface FetchBet2dPlayerParams {
  phpsessid: string
  base_URL: string
  pasaran: any
  website: string
  kode_pasar: string
}

const fetch_bet_semalam_player = async (params: FetchBet2dPlayerParams) => {
  const {
    base_URL,
    kode_pasar,
    phpsessid: PHPSESSID,
    website,
    pasaran,
  } = params

  const periode = await get_last_periode({
    kode_pasaran: kode_pasar,
    PHPSESSID,
    base_URL,
  })

  randomChalk(
    `Fetching data keluaran semalam  di pasaran ${pasaran} di ${website}`
  )

  const response = await axios<string>(
    `${base_URL}/admin_angka13.php?psr=p${kode_pasar}`,
    {
      headers: {
        ...common_headers({ phpsessid: PHPSESSID }),
        'sec-fetch-dest': 'frame',
        'sec-fetch-user': '?1',
        Referer: `${base_URL}/agent_bt.php`,
      },
    }
  )

  const table_raw_string = response.data
    ?.split("<TABLE width='80%'>")[1]
    ?.split('</TABLE>')[0]

  const keluaran_semalam = table_raw_string
    .split(
      `value=${
        +periode - 1
      }></td><td align=center width=10%><input type='text' name='angkax' size='5' value='`
    )[1]
    .split("' maxlength='4'>")[0]

  const new_data_semalam = Semalam.build({
    angka_keluar: keluaran_semalam,
    periode,
    pasaran,
    website,
  })
  await new_data_semalam.save()
  return
}

export { fetch_bet_semalam_player }
