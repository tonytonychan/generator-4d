import { Request, Response } from 'express'
import { randomChalk } from 'ody-utils'
import { website_list } from '../../constants/website-list'
import Result from '../../models/result'
import generate_4d_array from '../../services/generator/generate-4d-array'
import * as IDN from '../../services/idn'
import get_prediksi_result from '../../services/idn/prediksi'
import get_random_data from '../../utils/get-random-data'
import { return_plain_num } from '../../utils/return-plain-num'

const fetch_prediksi_controller = async (req: Request, res: Response) => {
  const pasaran_query = req.query.pasaran_query as string
  const match_query = req.query.match_query as string

  if (!pasaran_query)
    throw new Error('Please provide pasaran as a query value!')

  if (!match_query)
    throw new Error('Please provide match_query as a query value!')

  const filtered_website_list = IDN.convert_string_to_kode_pasar({
    data_array: website_list,
    pasaran: pasaran_query,
  })

  const array_to_check = await generate_4d_array({
    pasaran: pasaran_query,
    match_query,
  })

  const angka_prediksi_array = []

  for (let i = 0; i < 9; i) {
    const angka_prediksi = get_random_data(array_to_check)
    angka_prediksi_array.push(angka_prediksi)
  }

  for (const website of filtered_website_list) {
    const { phpsessid: PHPSESSID } = await IDN.login({
      username: website.username,
      password: website.password,
      pin: website.pin,
      base_url: website.baseURL,
    })

    const periode = await IDN.get_last_periode({
      kode_pasaran: website.pasaran,
      PHPSESSID,
      base_URL: website.baseURL,
    })
    for (const angka_prediksi of angka_prediksi_array) {
      const { hasil, detail } = await get_prediksi_result({
        angka_prediksi: angka_prediksi.map(num => num.toString()),
        periode,
        kode_pasaran: website.pasaran,
        PHPSESSID,
        baseURL: website.baseURL,
      })

      detail['website'] = website.website

      const new_prediksi_data = Result.build({
        angka_keluar: angka_prediksi.map(num => num.toString()),
        hasil: return_plain_num(hasil),
        pasaran: pasaran_query,
        total_omset: detail['Total Omset'] ? +detail['Total Omset'] : 0,
        detail: detail,
      })

      await new_prediksi_data.save()

      randomChalk('Berhasil menyimpan data prediksi')
    }
  }

  res.status(200).json({ message: 'Berhasil fetch data prediksi' })
}

export default fetch_prediksi_controller
