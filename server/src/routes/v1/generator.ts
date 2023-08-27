import express from 'express'
import fetch_prediksi_controller from '../../controllers/result/fetch-prediksi'
import get_highest_profit_number_controller from '../../controllers/result/get-highest-profit-number'
import fetch_all_bet_controller from '../../controllers/result/fetch-bet'

const router = express.Router()

router.get('/fetch-bet', fetch_all_bet_controller)
router.get('/fetch-prediksi', fetch_prediksi_controller)
router.get('/', get_highest_profit_number_controller)

export { router as generator_router_v1 }
