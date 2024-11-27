import express from 'express'
import LoyaltyProgramController from '../Functions/LoyaltyProgramController.js'

const loyaltyProgramRoute = express.Router()

loyaltyProgramRoute.post('/signup', LoyaltyProgramController.signUp)

export default loyaltyProgramRoute
