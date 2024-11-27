import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import environments from '../config/environments.js'
import adminRepository from '../Repositories/adminRepository.js'
import GuestRepository from '../Repositories/GuestRepository.js'
import { returnError } from '../utils/resUtils.js'

const signToken = (id: ObjectId) => {
	return jwt.sign({ id }, environments.JWT_SECRET, {
		expiresIn: environments.JWT_EXPIRESIN,
	})
}

const adminController = {
	registerAdmin: async (req: Request, res: Response) => {
		try {
			const { email, fullName, password } = req.body

			const admin = await adminRepository.registerAdmin({
				email,
				fullName,
				password,
			})

			const token = signToken(admin?._id)

			return res.status(201).json({
				success: true,
				token,
				admin,
				message: 'You have rejistered successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	ageVerification: async (req: Request, res: Response) => {
		try {
			const { status, limit, page } = req.query
			const users = await adminRepository.ageVerification({
				status: status as string,
				limit: Number(limit),
				page: Number(page),
			})
			return res.status(200).json({
				success: true,
				users,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getUserById: async (req: Request, res: Response) => {
		try {
			const { userId } = req.query
			const result = await adminRepository.getUserById(userId as string)
			res.status(200).json({ success: true, result })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	searchUser: async (req: Request, res: Response) => {
		try {
			const { search, status, role } = req.query
			const result = await adminRepository.searchUser(
				search as string,
				status as string,
				role as 'admin' | 'buyer'
			)
			res.json({ success: true, result })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	updateAgeVerificationStatus: async (req: Request, res: Response) => {
		try {
			const { userId, status } = req.body
			const result = await adminRepository.updateUserStatus(userId, status)

			return res.status(200).json({
				success: true,
				result,
				message: `Status has been updated to ${status} successfully`,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getAllSubscribers: async (req: Request, res: Response) => {
		try {
			const { page, limit } = req.query
			const subscribers = await adminRepository.getAllSubscribers(
				Number(page),
				Number(limit)
			)
			res.status(200).json({
				success: true,
				subscribers,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	loginAdmin: async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body

			const admin = await adminRepository.loginAdmin(email, password)
			const token = signToken(admin?._id)

			return res.status(200).json({
				success: true,
				token,
				admin,
				message: 'You have logged In successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	adminCreateProduct: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id

			const productImage = req.files
				? req.files['productImage']
					? req.files['productImage'][0]
					: ''
				: ''
			const images = req.files
				? req.files['images']
					? req.files['images']
					: []
				: []
			const {
				productName,
				quantity,
				productPrice,
				category,
				subCategory,
				description,
				featured,
				promoted,
				currency,
				videos,
				highlights,
				whatInsideTheBox,
				color,
				discount,
				tag,
				ingredients,
				dietary,
			} = req.body

			const product = await adminRepository.addProduct({
				productName,
				quantity,
				productPrice,
				category,
				subCategory,
				description,
				featured,
				promoted,
				currency,
				videos,
				highlights,
				whatInsideTheBox,
				color,
				discount,
				sellerId: adminId,
				productImage,
				images,
				tag,
				ingredients,
				dietary,
			})

			return res.status(201).json({
				success: true,
				product,
				message: 'Product has been added successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	dashboard: async (req: Request, res: Response) => {
		try {
			const dashboardData = await adminRepository.dashboardData()
			res.json({ success: true, dashboardData })
		} catch (error) {
			returnError(req, res, error)
		}
	},

	createNewCategory: async (req: Request, res: Response) => {
		try {
			const { name, subCategories } = req.body

			const icon = req.files
				? req.files['icon']
					? req.files['icon'][0]
					: ''
				: ''

			const category = await adminRepository.addNewCategory({
				name,
				icon,
				subCategories,

				// ranking,
			})

			return res.status(201).json({
				success: true,
				category,
				message: `New category ${name} has been added`,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	addNewSlider: async (req: Request, res: Response) => {
		try {
			const { url } = req.body
			const sliderImage = req.files
				? req.files['image']
					? req.files['image'][0]
					: ''
				: ''

			const slider = await adminRepository.addNewSlider({ url, sliderImage })
			return res.status(200).json({
				success: true,
				slider,
				message: 'Seller has been added successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	sellerOrders: async (req: Request, res: Response) => {
		try {
			const sellerId = req.admin._id

			const orders = await adminRepository.sellerOrders(sellerId)

			return res.status(200).json({
				success: true,
				length: orders.length,
				orders,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	ordersStats: async (req: Request, res: Response) => {
		try {
			const sellerId = req.admin._id

			const stats = await adminRepository.ordersStats(sellerId)

			return res.status(200).json({
				success: true,
				stats,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getApplications: async (req: Request, res: Response) => {
		try {
			const { status } = req.query
			const applications = await adminRepository.getApplications(
				status as string
			)
			res.status(200).json({ success: true, applications })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getApplicationById: async (req: Request, res: Response) => {
		try {
			const { applicationId } = req.query
			const application = await adminRepository.getApplicationById(
				applicationId as string
			)
			res.status(200).json({ success: true, application })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	respondApplication: async (req: Request, res: Response) => {
		try {
			const { status, applicationId } = req.body
			const result = await adminRepository.respondApplication(
				status as string,
				applicationId as string
			)
			res.status(200).json({
				success: true,
				result,
				message: `Application status has been changed to ${status}`,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	productByStatus: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { status, page, limit } = req.query
			const products = await adminRepository.getProductByStatus(
				adminId,
				status as any,
				page as any,
				limit as any
			)
			res.status(200).json({ success: true, products })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	productById: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { productId } = req.query
			const product = await adminRepository.productById(
				productId as string,
				adminId as ObjectId
			)
			res.status(200).json({ success: true, product })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	searchProducts: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { search, page } = req.query
			const result = await adminRepository.searchProducts(
				adminId as ObjectId,
				search as string,
				page as any
			)
			res.json({ success: true, result })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	updateProductStatus: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { productId, status } = req.query
			const product = await adminRepository.updateProductStatus(
				adminId,
				status as any,
				productId as string
			)
			res.status(200).json({
				success: true,
				product,
				message: `Product status has been updated to ${status}`,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	orderByStatus: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { status, page } = req.query
			const orders = await adminRepository.orderByStatus(
				adminId,
				status as any,
				page as any
			)
			res.status(200).json({ success: true, orders })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	orderById: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { orderId } = req.query
			const order = await adminRepository.orderById(
				orderId as string,
				adminId as ObjectId
			)
			res.status(200).json({ success: true, order })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	updateOrderStatus: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { orderId, status } = req.query
			const updatedOrder = await adminRepository.updateOrderStatus(
				adminId,
				status as any,
				orderId as string
			)
			res.status(200).json({
				success: true,
				updatedOrder,
				message: `Order status has been updated successfully`,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getAllContacts: async (req: Request, res: Response) => {
		try {
			const contacts = await GuestRepository.getAllContacts()
			res.status(201).json({ success: true, contacts })
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default adminController
