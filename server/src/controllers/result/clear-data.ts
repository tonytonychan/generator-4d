import { RequestHandler } from 'express'
import Result from '../../models/result'

const clear_data_controller: RequestHandler = async (req, res) => {
  const pasaran = req.query.pasaran_query

  await Result.deleteMany({ pasaran })
  res.status(200).json({ message: 'Berhasil clear data result' })
}

export default clear_data_controller
