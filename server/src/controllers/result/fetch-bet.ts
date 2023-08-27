import { RequestHandler } from 'express'
import { body } from 'express-validator'
import { randomChalk } from 'ody-utils'
import { website_list } from '../../constants/website-list'
import { Bet } from '../../models/bet'
import * as IDN from '../../services/idn'

const fetch_all_bet_validator = [
  body('pasaran').isString().withMessage('pasaran must be a string'),
]

const fetch_all_bet_controller: RequestHandler = async (req, res) => {
  const pasaran = req.body.pasaran.toString().toUpperCase()

  await Bet.deleteMany({ pasaran })
  randomChalk(`deleted currently saved bet data for ${pasaran}`)

  const filtered_website_list = IDN.convert_string_to_kode_pasar({
    data_array: website_list,
    pasaran,
  })

  for (const website of filtered_website_list) {
    const { phpsessid } = await IDN.login({
      username: website.username,
      password: website.password,
      pin: website.pin,
      base_url: website.baseURL,
    })

    if (!phpsessid) throw new Error('Gagal login ke IDN')

    await IDN.fetch_bet_2D_player({
      phpsessid,
      base_URL: website.baseURL,
      pasaran,
      website: website.website,
      kode_pasar: website.pasaran,
    })
  }

  //! fetch_bet_3D_player

  //! fetch_bet_4D_player

  randomChalk(`Fetching data semua website Selesai`)
  res.status(200).json({ message: 'Berhasil fetch data bet Players' })
}

export { fetch_all_bet_controller, fetch_all_bet_validator }
