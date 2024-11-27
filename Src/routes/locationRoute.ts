import express from 'express'
import LocationController from '../Functions/LocationController.js'

const locationRoute = express.Router()

locationRoute.get('/', LocationController.locations)

export default locationRoute
