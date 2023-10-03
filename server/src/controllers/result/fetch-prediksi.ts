import { Request, Response } from 'express'
import generate_4d_array from '../../services/generator/generate-4d-array'
import get_random_data from '../../utils/get-random-data'
import { return_plain_num } from '../../utils/return-plain-num'
import * as IDN from '../../services/idn'
import get_prediksi_result from '../../services/idn/prediksi'
import { randomChalk } from 'ody-utils'
import { website_list } from '../../constants/website-list'
import Result from '../../models/result'

const fetch_prediksi_controller = async (req: Request, res: Response) => {
  const pasaran_query = req.query.pasaran_query as string
  const show_kembar = req.query.show_kembar as string

  if (!pasaran_query)
    throw new Error('Please provide pasaran as a query value!')

  const filtered_website_list = IDN.convert_string_to_kode_pasar({
    data_array: website_list,
    pasaran: pasaran_query,
  })

  const array_to_check = await generate_4d_array({
    pasaran: pasaran_query,
    show_kembar,
  })

  const angka_prediksi = get_random_data(array_to_check)

  // for (const website of filtered_website_list) {
  //   const { phpsessid: PHPSESSID } = await IDN.login({
  //     username: website.username,
  //     password: website.password,
  //     pin: website.pin,
  //     base_url: website.baseURL,
  //   })

  //   const periode = await IDN.get_last_periode({
  //     kode_pasaran: website.pasaran,
  //     PHPSESSID,
  //     base_URL: website.baseURL,
  //   })

  //   for (const arr_of_three_4d_digit of angka_prediksi) {
  //     const { hasil, detail } = await get_prediksi_result({
  //       angka_prediksi: arr_of_three_4d_digit.map(num => num.toString()),
  //       periode,
  //       kode_pasaran: website.pasaran,
  //       PHPSESSID,
  //       baseURL: website.baseURL,
  //     })

  //     detail['website'] = website.website

  //     const new_prediksi_data = Result.build({
  //       angka_keluar: arr_of_three_4d_digit.map(num => num.toString()),
  //       hasil: return_plain_num(hasil),
  //       pasaran: pasaran_query,
  //       total_omset: detail['Total Omset'] ? +detail['Total Omset'] : 0,
  //       detail: detail,
  //     })

  //     await new_prediksi_data.save()
  //   }

  //   randomChalk('Berhasil menyimpan data prediksi')
  // }

  await Promise.all(
    filtered_website_list.map(async website => {
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
      for (const arr_of_three_4d_digit of angka_prediksi) {
        const { hasil, detail } = await get_prediksi_result({
          angka_prediksi: arr_of_three_4d_digit.map(num => num.toString()),
          periode,
          kode_pasaran: website.pasaran,
          PHPSESSID,
          baseURL: website.baseURL,
        })

        detail['website'] = website.website

        const new_prediksi_data = Result.build({
          angka_keluar: arr_of_three_4d_digit.map(num => num.toString()),
          hasil: return_plain_num(hasil),
          pasaran: pasaran_query,
          total_omset: detail['Total Omset'] ? +detail['Total Omset'] : 0,
          detail: detail,
        })
        await new_prediksi_data.save()
      }
      randomChalk('Berhasil menyimpan data prediksi')
    })
  )

  res
    .status(200)
    .json({ message: 'Berhasil fetch data prediksi', data: angka_prediksi })
}

export default fetch_prediksi_controller
