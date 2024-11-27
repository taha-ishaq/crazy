import express from 'express'
import CartController from '../Functions/CartController.js'
import Authentication from '../Middleware/Authentication.js'

const cartRoute = express.Router()

cartRoute.get('/', Authentication.passport, CartController.cart)
cartRoute.post('/', Authentication.passport, CartController.updateCart)

cartRoute.get(
	'/buy-now-data',
	Authentication.passport,
	CartController.productData
)

export default cartRoute
