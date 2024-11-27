import express from 'express'
import buyerController from '../Functions/buyerController.js'
import CouponController from '../Functions/couponController.js'
import reviewController from '../Functions/reviewController.js'
import Authentication from '../Middleware/Authentication.js'
import { multipleFileWithMultipleFieldsUploadMiddleware } from '../services/cloudinaryService.js'
// import Authentication from '../middlewares/Authentication.js'
const buyerRoute = express.Router()

buyerRoute.get(
	'/home-data',
	Authentication.openPassport,
	buyerController.buyerHomeData
)

buyerRoute.get(
	'/all-categories',
	// Authentication.passport,
	buyerController.getAllCategories
)
// All Products of specific category
buyerRoute.get(
	'/productById',
	Authentication.openPassport,
	buyerController.productById
)

buyerRoute.get(
	'/allSliders',
	// Authentication.passport,
	buyerController.getAllSliders
)

// Buyer Search Product API
buyerRoute.get(
	'/search-product',
	Authentication.openPassport,
	buyerController.buyerSearchProduct
)
buyerRoute.get(
	'/get-recent-searches',
	Authentication.openPassport,
	buyerController.getSearchesHistory
)
// Buyer Cart routes
buyerRoute.post(
	'/addToCart',
	Authentication.passport,
	buyerController.addToCart
)
buyerRoute.post(
	'/delete-specific-cart-item',
	Authentication.passport,
	buyerController.deleteSpecificProductFromCart
)
buyerRoute.get(
	'/coupons',
	Authentication.passport,
	CouponController.couponByUserId
)
buyerRoute.get(
	'/coupons-with-status',
	Authentication.passport,
	CouponController.getCouponsWithStatus
)

// Buyer orders route
buyerRoute.post(
	'/createOrder',
	Authentication.passport,
	buyerController.createOrder
)

// buyerRoute.post(
// 	'/wallet',
// 	Authentication.passport,
// 	buyerController.createSquareAccount
// )
buyerRoute.post('/topup', Authentication.passport, buyerController.topUp)

// All Buyer orders
buyerRoute.get('/orders', Authentication.passport, buyerController.buyerOrders)
buyerRoute.get(
	'/order-by-status',
	Authentication.passport,
	buyerController.orderByStatus
)

buyerRoute.get('/profile', Authentication.passport, buyerController.profile)
buyerRoute.patch(
	'/profile',
	Authentication.passport,
	multipleFileWithMultipleFieldsUploadMiddleware([
		{ name: 'profilePic', maxCount: 1 },
	]),
	buyerController.updateProfile
)
buyerRoute.post(
	'/idCard',
	Authentication.passport,
	multipleFileWithMultipleFieldsUploadMiddleware([
		{ name: 'idCardFront', maxCount: 1 },
		{ name: 'idCardBack', maxCount: 1 },
	]),
	buyerController.uploadIdCard
)
buyerRoute.get('/orderbyid', Authentication.passport, buyerController.orderById)

// Buyer favorites route

// Add to favorite
buyerRoute.put(
	'/addToFavorite',
	Authentication.passport,
	buyerController.addFavorite
)
// Remove from favorite
buyerRoute.put(
	'/removeFromFavorite',
	Authentication.passport,
	buyerController.removeFavorite
)
// All favorite products of specific user/buyer
buyerRoute.get(
	'/allFavoriteBuyer',
	Authentication.passport,
	buyerController.getAllFavoriteProducts
)

// Buyer Address Route

// Add Buyer Delivery address
buyerRoute.put(
	'/addBuyerAddress',
	Authentication.passport,
	buyerController.setNewBuyerAddress
)
// Get All Buyer Address
buyerRoute.get(
	'/allBuyerAddresses',
	Authentication.passport,
	buyerController.getAllBuyerAddresses
)

// Buyer Payment Method routes

// Add Payment method
// buyerRoute.post(
// 	'/addPaymentCard',
// 	Authentication.passport,
// 	buyerController.addNewPaymentCard
// )
// Get All Payment Methods
buyerRoute.get(
	'/cardSpecificUser',
	Authentication.passport,
	buyerController.getAllCardSpecificBuyer
)
buyerRoute.post('/review', Authentication.passport, reviewController.create)
export default buyerRoute
