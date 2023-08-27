import express from 'express'
import fetch_prediksi from '../../controllers/result/fetch-prediksi'
import get_highest_profit_number from '../../controllers/result/get-highest-profit-number'

const router = express.Router()

router.get('/fetch', fetch_prediksi)
router.get('/', get_highest_profit_number)

export { router as generator_router_v1 }
