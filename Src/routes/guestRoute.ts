import express from 'express'
import guestController from '../Functions/guestController.js'
const guestRoute = express.Router()
guestRoute.post('/contact-request', guestController.contactUsRequestCreate)
export default guestRoute
