import express from 'express'
import adminController from '../Functions/adminController.js'
// import adminAuthentication from '../middlewares/adminAuthentication.js'
import businessController from '../Functions/businessController.js'
import buyerController from '../Functions/buyerController.js'
import CouponController from '../Functions/couponController.js'
import jobController from '../Functions/jobController.js'
import lendingPageController from '../Functions/LandingPageController.js'
import newsController from '../Functions/NewsController.js'
import withdrawalController from '../Functions/withdrawalController.js'
import adminAuthentication from '../Middleware/adminAuthentication.js'
import { multipleFileWithMultipleFieldsUploadMiddleware } from '../services/cloudinaryService.js'
const adminRoute = express.Router()

// Auth admin routes
adminRoute.post('/register-admin', adminController.registerAdmin)
adminRoute.post('/login-admin', adminController.loginAdmin)

// Admin Operational routes

// Add Product
adminRoute.post(
	'/create-product',
	adminAuthentication.passport,
	multipleFileWithMultipleFieldsUploadMiddleware([
		{ name: 'productImage', maxCount: 1 },
		{ name: 'images', maxCount: 5 },
	]),
	adminController.adminCreateProduct
)
adminRoute.get(
	'/product-by-id',
	adminAuthentication.passport,
	adminController.productById
) //tested at postman
adminRoute.get(
	'/product-by-status',
	adminAuthentication.passport,
	adminController.productByStatus
)
adminRoute.patch(
	'/update-product-status',
	adminAuthentication.passport,
	adminController.updateProductStatus
)
adminRoute.get(
	'/order-by-status',
	adminAuthentication.passport,
	adminController.orderByStatus
)
adminRoute.get(
	'/orderbyid',
	adminAuthentication.passport,
	adminController.orderById
)
adminRoute.patch(
	'/update-order-status',
	adminAuthentication.passport,
	adminController.updateOrderStatus
)
adminRoute.get('/dashboard', adminController.dashboard)
// Create new category
adminRoute.post(
	'/add-category',
	multipleFileWithMultipleFieldsUploadMiddleware([
		{ name: 'icon', maxCount: 1 },
	]),
	// adminAuthentication.passport,
	adminController.createNewCategory
)
adminRoute.get('/get-all-category-for-admin', buyerController.getAllCategories)
// Add new slider
adminRoute.post(
	'/add-slider',
	// adminAuthentication.passport,
	multipleFileWithMultipleFieldsUploadMiddleware([
		{ name: 'image', maxCount: 1 },
	]),
	adminController.addNewSlider
)

// Admin/Seller Orders
adminRoute.get(
	'/sellerOrders',
	adminAuthentication.passport,
	adminController.sellerOrders
)
adminRoute.get(
	'/job-applications',
	// adminAuthentication.passport,
	adminController.getApplications
)
adminRoute.get(
	'/application-by-id',
	adminAuthentication.passport,
	adminController.getApplicationById
)
adminRoute.patch(
	'/respond-job-application',
	adminAuthentication.passport,
	adminController.respondApplication
)
adminRoute.get(
	'/age-verification',
	adminAuthentication.passport,
	adminController.ageVerification
)
adminRoute.get(
	'/userById',
	adminAuthentication.passport,
	adminController.getUserById
)
adminRoute.patch(
	'/update-age-verification',
	adminAuthentication.passport,
	adminController.updateAgeVerificationStatus
)
adminRoute.get(
	'/search-user',
	adminAuthentication.passport,
	adminController.searchUser
)
adminRoute.get(
	'/search-products',
	adminAuthentication.passport,
	adminController.searchProducts
)

adminRoute.post(
	'/create-job',
	adminAuthentication.passport,
	jobController.create
)
adminRoute.get(
	'/getall-job-by-status',
	adminAuthentication.passport,
	jobController.getAll
)
adminRoute.get(
	'/getone-job/:id',
	adminAuthentication.passport,
	jobController.getOne
)
adminRoute.patch(
	'/update-job-status',
	adminAuthentication.passport,
	jobController.deleteJob
)
adminRoute.patch(
	'/update-job',
	adminAuthentication.passport,
	jobController.updateJob
)
adminRoute.get(
	'/withdrawals',
	adminAuthentication.passport,
	withdrawalController.getAdminWithdrawals
) // added to postman

adminRoute.patch(
	'/withdrawals/approve',
	adminAuthentication.passport,
	withdrawalController.adminApproveWithdrawal
) // added to postman

adminRoute.get(
	'/withdrawals/approved',
	adminAuthentication.passport,
	withdrawalController.getAdminApprovedWithdrawals
) // added to postman

adminRoute.post(
	'/create-coupons',
	adminAuthentication.passport,
	multipleFileWithMultipleFieldsUploadMiddleware([
		{ name: 'logo', maxCount: 1 },
	]),
	CouponController.createCoupons
)
adminRoute.get(
	'/get-coupons',
	adminAuthentication.passport,
	CouponController.getCouponByAdmin
)

adminRoute.delete(
	'/delete-coupon',
	adminAuthentication.passport,
	CouponController.deleteCoupon
)
adminRoute.get(
	'/orders/stats',
	adminAuthentication.passport,
	adminController.ordersStats
)
adminRoute.get(
	'/get-all-subscribers',
	adminAuthentication.passport,
	adminController.getAllSubscribers
)
adminRoute.get(
	'/connections',
	adminAuthentication.passport,
	lendingPageController.getAllConnections
)
adminRoute.get(
	'/connection-by-id',
	adminAuthentication.passport,
	lendingPageController.connectionById
)
adminRoute.post(
	'/business',
	adminAuthentication.passport,
	businessController.create
)
adminRoute.post('/news', adminAuthentication.passport, newsController.create)

adminRoute.get(
	'/contact-requests',
	adminAuthentication.passport,
	adminController.getAllContacts
)
export default adminRoute
