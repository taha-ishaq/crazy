import bcyrpt from 'bcryptjs'
// import { ObjectId } from 'mongoose'
import mongoose, { ObjectId, PipelineStage } from 'mongoose'
import Admin from '../Model/adminModel.js'
import Category from '../Model/categoryModel.js'

import { IAmount } from '../Model/interface/IAmount.js'

import jobApplicationModel from '../Model/jobApplicationModel.js'
import Order from '../Model/orderModel.js'
import Product from '../Model/Product.Model.js'
import Slider from '../Model/sliderModel.js'
import Subscriber from '../Model/SubscriberModel.js'
import User from '../Model/User.Model.js'
import { uploadToCloudinary } from '../services/cloudinaryService.js'
import IntlUtil from '../utils/IntlUtils.js'
class adminRepository {
	public async registerAdmin(data: {
		email: string
		fullName: string
		password: string
	}) {
		if (!data.email || !data.password || !data.fullName) {
			throw Error('Missing Required Credentials')
		}

		const admin = await Admin.create(data)
		return admin
	}

	public async loginAdmin(email: string, password: string) {
		if (!email || !password) {
			throw Error('Missing Required credentials (email,password)')
		}

		const checkAdmin = await Admin.findOne({ email })
		if (!checkAdmin) {
			throw Error('Invalid Credentials Details')
		}
		const correct = await bcyrpt.compare(password, checkAdmin.password)

		if (!correct) {
			throw Error('Invalid Credentials Details')
		}

		return checkAdmin
	}

	public async addProduct(data: {
		productName: string
		quantity: number
		productPrice: number
		category: string[]
		subCategory: string[]
		description: string
		featured: boolean
		promoted: boolean
		currency: boolean
		videos: string[]
		highlights: string[]
		whatInsideTheBox: string
		color: string
		discount: number
		sellerId: ObjectId
		productImage: Object & { path: string }
		images: [Object & { path: string }]
		tag: string[]
		ingredients: string
		dietary: string
	}) {
		if (!data.sellerId) {
			throw Error('Missing Seller Id')
		}
		const update: { productImage?: string; images?: string[] } = {}
		const folder = IntlUtil.selectFolderByCategory(data.category[0])
		if (data.productImage && data.productImage.path && folder) {
			const productImage = await uploadToCloudinary(
				data.productImage.path,
				folder
			)
			update.productImage = productImage
		}
		if (data.images && folder) {
			const imageUploadPromises = data.images.map(
				async (image) => await uploadToCloudinary(image.path, folder)
			)
			const images = await Promise.all(imageUploadPromises)
			update.images = images.map(String) // Map to string to avoid casting issues
		}

		const product = await Product.create({
			productName: data.productName,
			productImage: update.productImage,
			productPrice: {
				amount: data.productPrice,
				currency: data.currency,
			},
			category: data.category,
			subCategory: data.subCategory,
			tag: data.tag,
			discount: data.discount,
			images: update.images,
			description: data.description,
			featured: data.featured,
			promoted: data.promoted,
			videos: data.videos,
			highlights: data.highlights,
			whatInsideTheBox: data.whatInsideTheBox,
			sellerId: data.sellerId,
			color: data.color,
			quantity: data.quantity,
			ingredients: data.ingredients,
			dietary: data.dietary,
		})

		if (product) {
			return product
		}
	}

	public async getProductByStatus(
		adminId: ObjectId,
		status: 'active' | 'inactive' | 'rejected' | 'deleted',
		page: number = 1,
		limit: number = 20
	) {
		if (!adminId) throw new Error('Invalid Admin!!')
		if (!status) throw new Error('Enter the valid data!!')
		const products = await Product.find({
			availabilityStatus: status,
		})
			.limit(limit)
			.skip((page - 1) * limit)
			.lean()
		return products
	}
	public async productById(productId: string, adminId: ObjectId) {
		if (!adminId) throw new Error('Invalid Admin!!')
		if (!productId) throw new Error('Invalid Product!!')
		const product = await Product.findById(productId)
		if (!product) throw new Error('product not found')
		return product
	}
	public async searchProducts(
		adminId: ObjectId,
		search: string,
		page: number = 1
	) {
		const result = await Product.find({
			sellerId: adminId,
			productName: { $regex: `\\b${search}\\b`, $options: 'i' },
		})
			.limit(10)
			.skip((page - 1) * 10)
			.lean()
		return result
	}
	public async updateProductStatus(
		adminId: ObjectId,
		status: 'active' | 'inactive' | 'rejected' | 'deleted',
		productId: string
	) {
		if (!adminId) throw new Error('Invalid Admin!!')
		if (!productId) throw new Error('Invalid Product!!')
		if (!status) throw new Error('Enter the valid data!!')
		const updatedProduct = await Product.findOneAndUpdate(
			{
				sellerId: adminId,
				_id: new mongoose.Types.ObjectId(productId),
			},
			{ availabilityStatus: status },
			{ new: true }
		)
		return updatedProduct
	}

	public async orderByStatus(
		adminId: ObjectId,
		status: 'processed' | 'assigned' | 'delivered' | 'confirmed' | 'cancelled',
		page: number = 1
	) {
		if (!adminId) throw new Error('Invalid Admin!!')
		if (!status) throw new Error('Enter the valid data!!')
		const orders = await Order.find({
			sellerId: adminId,
			orderStatus: status,
		})
			.populate('items.product')
			.sort({ createdAt: -1 })
			.limit(10)
			.skip((page - 1) * 10)
			.lean()

		return orders
	}
	public async orderById(orderId: string, adminId: ObjectId) {
		if (!adminId) throw new Error('Invalid Admin!!')
		if (!orderId) throw new Error('Invalid Product!!')
		const order = await Order.findById(orderId).populate('items.product').lean()
		if (!order) throw new Error('order Not found')

		return order
	}
	public async updateOrderStatus(
		adminId: ObjectId,
		status: 'processed' | 'assigned' | 'delivered' | 'confirmed' | 'cancelled',
		orderId: string
	) {
		if (!adminId) throw new Error('Invalid Admin!!')
		if (!status) throw new Error('Enter the valid data!!')

		const updatedOrder = await Order.findOneAndUpdate(
			{
				_id: new mongoose.Types.ObjectId(orderId),
				sellerId: adminId,
			},
			{ orderStatus: status },
			{ new: true }
		)
		return updatedOrder
	}

	public async addNewCategory(data: {
		name: string
		icon: Object & { path: string }
		subCategories: string[]
		// ranking: number
	}) {
		if (!data.name) {
			throw Error('Category name is required')
		}
		// console.log(data)
		// if (!data.ranking) {
		// 	throw Error('Please specify category ranking 1(Top) 10(Lowest)')
		// }
		const update: { icon?: string } = {}

		if (data.icon && data.icon.path) {
			const icon = await uploadToCloudinary(
				data.icon.path,
				'crazyByRasel/category'
			)

			update.icon = icon
		}
		const checkCategory = await Category.findOne({ name: data.name })
		if (!checkCategory) {
			const category = await Category.create({
				name: data.name,
				icon: update.icon,
				subCategories: data.subCategories,
			})

			return category
		} else throw new Error('category already exist!!')
	}
	public async addNewSlider(data: {
		url: string
		sliderImage: Object & { path: string }
	}) {
		if (!data.sliderImage) {
			throw Error('Missing Required Slider Image')
		}
		const update: { image?: string } = {}

		if (data.sliderImage && data.sliderImage.path) {
			const image = await uploadToCloudinary(
				data.sliderImage.path,
				'crazyByRasel/slider'
			)
			update.image = image
		}

		const slider = await Slider.create({
			url: data.url,
			image: update.image,
		})

		return slider
	}

	public async sellerOrders(sellerId: ObjectId) {
		const orders = await Order.find({ sellerId }).populate('items.product')
		return orders
	}
	public async getAllSubscribers(page: number = 1, limit: number = 20) {
		const subscribers = await Subscriber.find()
			.limit(limit)
			.skip((page - 1) * limit)
			.lean()
		if (!subscribers) throw new Error('No subscriber found')
		return subscribers
	}

	public async ordersStats(sellerId: string) {
		const now = new Date()
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
		const endOfMonth = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59,
			999
		)

		const pipeline: PipelineStage[] = [
			{ $match: { sellerId } },
			{
				$facet: {
					ongoingOrders: [
						{
							$match: {
								orderStatus: { $in: ['processed', 'assigned', 'confirmed'] },
							},
						},
						{ $count: 'count' },
					],
					cancelledOrders: [
						{ $match: { orderStatus: 'cancelled' } },
						{ $count: 'count' },
					],
					thisMonthDeliveredOrders: [
						{
							$match: {
								orderStatus: 'delivered',
								updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
							},
						},
						{ $count: 'count' },
					],
					thisMonthRevenue: [
						{
							$match: {
								orderStatus: 'delivered',
								updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
							},
						},
						{
							$group: {
								_id: null,
								totalRevenue: { $sum: '$totals.grandTotal.amount' },
							},
						},
					],
				},
			},
		]

		const statsRecord = await Order.aggregate(pipeline)

		const productCount = await Product.countDocuments({ sellerId })

		const ongoingOrdersCount = statsRecord[0]?.ongoingOrders[0]?.count || 0
		const cancelledOrdersCount = statsRecord[0]?.cancelledOrders[0]?.count || 0
		const thisMonthDeliveredOrdersCount =
			statsRecord[0]?.thisMonthDeliveredOrders[0]?.count || 0
		const thisMonthRevenue =
			statsRecord[0]?.thisMonthRevenue[0]?.totalRevenue || 0

		const stats: {
			title: string
			type: 'count' | 'amount'
			count?: number
			price?: IAmount
		}[] = [
			{
				title: 'Total Products',
				type: 'count',
				count: productCount,
			},
			{
				title: 'Ongoing Orders',
				type: 'count',
				count: ongoingOrdersCount,
			},
			{
				title: 'Cancelled Orders',
				type: 'count',
				count: cancelledOrdersCount,
			},
			{
				title: 'This Month Delivered Orders',
				type: 'count',
				count: thisMonthDeliveredOrdersCount,
			},
			{
				title: 'This Month Revenue',
				type: 'amount',
				price: {
					amount: thisMonthRevenue,
					currency: 'USD',
				},
			},
		]

		return stats
	}

	public async getApplications(status: string) {
		const appliations = await jobApplicationModel.find({ status }).lean()
		return appliations
	}
	public async getApplicationById(applicationId: string) {
		const application = await jobApplicationModel.findById(applicationId).lean()
		if (!application) throw new Error('Application Not Found!!')
		return application
	}
	public async respondApplication(status: string, applicationId: string) {
		const updatedApplication = await jobApplicationModel
			.findByIdAndUpdate(applicationId, { status }, { new: true })
			.lean()
		return updatedApplication
	}

	public async ageVerification(data: {
		status: string
		limit?: number
		page?: number
	}) {
		const limit = data.limit || 10
		const page = data.page || 1

		const users = await User.find(
			{
				'personalInformation.idCard.status': data.status,
			},
			'personalInformation credentialDetails.email'
		)
			.limit(limit)
			.skip(limit * (page - 1))
			.lean()

		return users
	}
	public async getUserById(userId: string) {
		const user = await User.findById(userId)
		if (!user) throw new Error('user not found')
		return user
	}
	public async searchUser(
		search: string,
		status: string,
		role: 'admin' | 'buyer'
	) {
		const result = await User.find({
			role: role,
			'personalInformation.idCard.status': status,

			'personalInformation.fullName': {
				$regex: new RegExp(`\\b${search}\\b`, 'i'),
			},
		})
			.limit(10)
			.lean()

		return result
	}
	public async updateUserStatus(userId: string, status: string) {
		if (!userId) throw new Error('invalid User!!')
		if (!status) throw new Error('invalid input!!')
		const verifiedUser = await User.findByIdAndUpdate(
			userId,
			{
				'personalInformation.idCard.status': status,
			},
			{ new: true }
		).lean()
		return verifiedUser
	}
	public async dashboardData() {
		const [productCount, verifiedUsers, pendingUsers, subscriberCount] =
			await Promise.all([
				Product.countDocuments(),
				User.countDocuments({
					'personalInformation.idCard.status': 'approved',
				}),
				User.countDocuments({
					'personalInformation.idCard.status': 'pending',
				}),
				Subscriber.countDocuments(),
			])

		const orders = await Order.find()
			.select('items')
			.populate('items.product')
			.lean()
		let totalRevenue = 0
		const orderCount = orders.length
		orders.forEach((order: any) => {
			order.items.forEach((item: any) => {
				if (item && item.product && item.product.productPrice) {
					totalRevenue += item.product.productPrice.amount * item.quantity
				}
			})
		})

		const dashboardData = {
			productCount,
			verifiedUsers,
			pendingUsers,
			totalRevenue,
			orderCount,
			subscriberCount,
		}
		return dashboardData
	}
}

export default new adminRepository()
