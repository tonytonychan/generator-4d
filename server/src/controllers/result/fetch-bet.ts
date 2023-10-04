import { RequestHandler } from 'express'
import { randomChalk } from 'ody-utils'
import { website_list } from '../../constants/website-list'
import { Bet } from '../../models/bet'
import * as IDN from '../../services/idn'
import Semalam from '../../models/semalam'

const fetch_all_bet_controller: RequestHandler = async (req, res) => {
  if (!req.query.pasaran) throw new Error('Please provide a pasaran query')
  const pasaran = req.query.pasaran.toString().toUpperCase()

  await Bet.deleteMany({ pasaran })
  randomChalk(`deleted currently saved bet data for ${pasaran}`)

  await Semalam.deleteMany({ pasaran })
  randomChalk(
    `deleted currently saved bet data keluaran semalam for ${pasaran}`
  )

  await Promise.all(
    website_list.map(async website => {
      const { phpsessid } = await IDN.login({
        username: website.username,
        password: website.password,
        pin: website.pin,
        base_url: website.baseURL,
      })

      await IDN.fetch_bet_2D_player({
        phpsessid,
        base_URL: website.baseURL,
        pasaran,
        website: website.website,
        kode_pasar: website.pasaran[pasaran],
      })

      await IDN.fetch_bet_3D_player({
        phpsessid,
        base_URL: website.baseURL,
        pasaran,
        website: website.website,
        kode_pasar: website.pasaran[pasaran],
      })

      await IDN.fetch_bet_4D_player({
        phpsessid,
        base_URL: website.baseURL,
        pasaran,
        website: website.website,
        kode_pasar: website.pasaran[pasaran],
      })

      await IDN.fetch_bet_semalam_player({
        phpsessid,
        base_URL: website.baseURL,
        pasaran,
        website: website.website,
        kode_pasar: website.pasaran[pasaran],
      })
    })
  )

  randomChalk(`Fetching data semua website Selesai`)
  res.status(200).json({ message: 'Berhasil fetch data bet Players' })
}

export default fetch_all_bet_controller
