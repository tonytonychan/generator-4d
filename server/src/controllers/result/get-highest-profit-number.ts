import { Response, Request } from 'express'
import Result from '../../models/result'
import { body } from 'express-validator'

export const get_highest_profit_validator = [
  body('pasaran_query')
    .isString()
    .withMessage('pasaran_query must be a string'),
]

const get_highest_profit_number_controller = async (req: Request, res: Response) => {
  const pasaran_query = req.query.pasaran

  if (!pasaran_query)
    throw new Error('Please provide pasaran as a query value!')

  const data = await Result.aggregate([
    {
      $group: {
        _id: '$website',
        maxPeriode: { $max: '$periode' },
      },
    },
    {
      $lookup: {
        from: 'results', // Replace with the actual collection name
        let: { website: '$_id', maxPeriode: '$maxPeriode' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$website', '$$website'] },
                  { $eq: ['$periode', '$$maxPeriode'] },
                ],
              },
            },
          },
        ],
        as: 'latestData',
      },
    },
    {
      $unwind: '$latestData',
    },
    {
      $replaceRoot: { newRoot: '$latestData' },
    },
    {
      $group: {
        _id: {
          website: '$website',
          detail: '$detail',
        },
        angka_keluar: { $push: '$angka_keluar' },
        hasil: { $sum: '$hasil' },
        total_omset: { $sum: { $toDouble: '$detail.Total Omset' } },
      },
    },
  ])

  res.status(200).send({ message: 'Berhasil mendapat angka pasaran', data })
}

export default get_highest_profit_number_controller
