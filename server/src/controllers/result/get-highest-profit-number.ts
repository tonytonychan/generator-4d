import { Response, Request } from 'express'
import Result from '../../models/result'

const get_highest_profit_number_controller = async (
  req: Request,
  res: Response
) => {
  const pasaran_query = req.query.pasaran_query

  if (!pasaran_query)
    throw new Error('Please provide pasaran as a query value!')

  const data = await Result.aggregate([
    {
      $match: {
        pasaran: pasaran_query,
      },
    },
    {
      $group: {
        _id: { pasaran: '$pasaran', angka_keluar: '$angka_keluar' },
        angka_keluar: { $first: '$angka_keluar' },
        total_omset: { $sum: '$total_omset' },
        details: { $push: '$detail' },
        hasil: { $sum: '$hasil' },
      },
    },
    {
      $project: {
        _id: 0,
        pasaran: '$_id.pasaran',
        angka_keluar: '$_id.angka_keluar',
        total_omset: 1,
        hasil: 1,
        details: '$details',
      },
    },
    {
      $sort: {
        hasil: -1,
      },
    },
    {
      $limit: 10
    },
  ])

  res.status(200).send({ message: 'Berhasil mendapat angka pasaran', data })
}

export default get_highest_profit_number_controller
