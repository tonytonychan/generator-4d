import express from 'express'
import { agent_router_v1 } from './agent'
import { generator_router_v1 } from './generator'

const router_v1 = express.Router()

router_v1.use('/agent', agent_router_v1)
router_v1.use('/generate', generator_router_v1)

export { router_v1 }
