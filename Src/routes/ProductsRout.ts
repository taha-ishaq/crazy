import express from 'express'
import ProductController from '../Functions/ProductController.js'
import Authentication from '../Middleware/Authentication.js'

const productsRoute = express.Router()

productsRoute.get(
	'/all-products',
	Authentication.openPassport,
	ProductController.getAllProducts
)
productsRoute.get(
	'/products-by-category',
	Authentication.openPassport,
	ProductController.getProductsByCategory
)
productsRoute.get(
	'/product-suggestion',
	Authentication.openPassport,
	ProductController.productSuggestion
)

export default productsRoute
