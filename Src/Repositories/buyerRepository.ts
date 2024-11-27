// import { ObjectId } from 'mongoose'
import { ObjectId, PipelineStage } from 'mongoose'
import environments from '../config/environments.js'
import Translations from '../Constant/Translations.js'
import Admin from '../Model/adminModel.js'
import Cart from '../Model/Cart.Model.js'
import Category from '../Model/categoryModel.js'
import Coupon from '../Model/couponModel.js'

import { IAmount } from '../Model/interface/IAmount.js'
import { ICartModule } from '../Model/interface/ICart.js'
import { IOrderModule } from '../Model/interface/IOrder.js'
import { ITransactionModule } from '../Model/interface/ITransaction.js'
import { IUserModule } from '../Model/interface/IUser.js'
import Order from '../Model/orderModel.js'
import Product from '../Model/Product.Model.js'
import Slider from '../Model/sliderModel.js'
import Transaction from '../Model/transactionModel.js'
import User from '../Model/User.Model.js'
import { uploadToCloudinary } from '../services/cloudinaryService.js'
import {
	createSquareAccount,
	processPayment,
} from '../services/square.Service.js'
class buyerRepository {
	public async cartOfSpecificBuyer(userId: ObjectId) {
		let cart = await Cart.findOne({ userId }).populate('items.product')
		let subTotal: ICartModule.ISubTotal = {
			title: 'Sub Total',
			price: { amount: 0, currency: 'USD' },
		}
		let deliveryFee: ICartModule.ISubTotal = {
			title: 'Delivery Fee',
			price: { amount: 0, currency: 'USD' },
		}
		let platformFee: ICartModule.ISubTotal = {
			title: 'Platform Fee',
			price: { amount: 0, currency: 'USD' },
		}

		if (!cart) {
			cart = await Cart.create({ userId, items: [] })
		} else {
			for (const item of cart.items) {
				const product = await Product.findById(item.product)
				if (product) {
					subTotal.price.amount +=
						(product.productPrice.amount -
							product.productPrice.amount * (product.discount / 100)) *
						item.quantity
				}
			}
			if (cart.items.length > 0) {
				deliveryFee = {
					title: 'Delivery Fee',
					price: { amount: 1, currency: 'USD' },
				}
				platformFee = {
					title: 'Platform Fee',
					price: { amount: 0.5, currency: 'USD' },
				}
			}
		}
		let orderTotal: IAmount = {
			amount:
				deliveryFee.price.amount +
				platformFee.price.amount +
				subTotal.price.amount,
			currency: 'USD',
		}

		let total: ICartModule.ISubTotal[] = []
		total.push(subTotal, deliveryFee, platformFee)
		const updatedCart = { ...cart.toObject(), total, orderTotal }

		return { cart: updatedCart }
	}

	public async getAllCategories(page: number = 1, limit: number = 20) {
		// if (!userId) {
		// 	throw Error('Missing user id')
		// }

		const categories = await Category.find()
			.limit(limit)
			.skip((page - 1) * limit)

		return categories
	}

	// public async productsOfSpecificCategory(categoryName: string) {
	// 	if (!categoryName) {
	// 		throw Error('Please specific category name')
	// 	}

	// 	const products = await Product.aggregate(
	// 		{
	// 		$and: [
	// 			{ availabilityStatus: 'active' },
	// 			{
	// 				$or: [
	// 					{ category: { $in: categoryName } },
	// 					{ subCategory: { $in: categoryName } },
	// 				],
	// 			},
	// 		],
	// 	}
	// )

	// 	return products
	// }
	public async orderByStatus(
		userId: ObjectId,
		orderStatus: string,
		page: number,
		limit: number
	) {
		if (!userId) throw new Error('Invalid User!!')

		const [orders, count] = await Promise.all([
			Order.find({
				userId,
				orderStatus,
			})
				.populate('items.product')
				.skip((page - 1) * limit)
				.limit(limit),
			Order.countDocuments({ userId, orderStatus }),
		])
		const totalPages = Math.ceil(count / (limit || 10))
		return { orders, totalPages }
	}

	public async getProductById(productId: string | ObjectId, userId?: ObjectId) {
		if (!productId) {
			throw Error('Missing product id')
		}
		const product = await Product.findById({ _id: productId })
			.select('+favoriteOf')
			.lean()
		if (!product) throw new Error('product not Found!!!')

		product['discountedPrice'] = {
			amount:
				product.productPrice.amount -
				(product.productPrice.amount * product.discount) / 100,
			currency: product.productPrice.currency,
		}
		product['priceBeforeDiscount'] = {
			//to avoid issus on front end
			amount: 0,
			currency: 'USD',
		}

		product['isFavorite'] = false

		if (userId) {
			const isFavorite = product.favoriteOf.some(
				(favorite: ObjectId) => favorite.toString() === userId.toString()
			)

			product['isFavorite'] = isFavorite
		}

		return product
	}
	// if (!userId) {
	// 	throw Error('Missing user id')
	// }
	// const pipeline: PipelineStage[] = [
	// 	{
	// 		$match: {
	// 			_id: productId,
	// 		},
	// 	},
	// 	{
	// 		$addFields: {
	// 			priceBeforeDiscount: '$productPrice',
	// 			percentageAfterDiscount: {
	// 				$subtract: [100, '$discount'],
	// 			},
	// 		},
	// 	},
	// 	{
	// 		$addFields: {
	// 			productPrice: {
	// 				currency: '$productPrice.currency',
	// 				amount: {
	// 					$multiply: [
	// 						'$productPrice.amount',
	// 						{
	// 							$divide: ['$percentageAfterDiscount', 100],
	// 						},
	// 					],
	// 				},
	// 			},
	// 			priceBeforeDiscount: '$productPrice',
	// 		},
	// 	},
	// 	{
	// 		$project: {
	// 			percentageAfterDiscount: 0,
	// 		},
	// 	},
	// ]

	// const data = await Product.aggregate(pipeline)

	// // 	// Single product Details
	// // 	const product = await Product.findById(productId)
	// // await Product.findByIdAndUpdate(product?._id, {
	// // 	$inc: { buyerViewCount: 1 },
	// // })

	// if (!data) {
	// 	throw Error('Product Not found')
	// }
	public async similarProducts(category: string) {
		const similarProductPipline: PipelineStage[] = [
			{
				$match: {
					category,
				},
			},
			{
				$sort: {
					buyerViewCount: -1,
				},
			},

			{
				$addFields: {
					priceBeforeDiscount: '$productPrice',
					percentageAfterDiscount: {
						$subtract: [100, '$discount'],
					},
				},
			},
			{
				$addFields: {
					productPrice: {
						currency: '$productPrice.currency',
						amount: {
							$multiply: [
								'$productPrice.amount',
								{
									$divide: ['$percentageAfterDiscount', 100],
								},
							],
						},
					},
					priceBeforeDiscount: '$productPrice',
				},
			},
			{
				$project: {
					discount: 1,
					productImage: 1,
					productPrice: 1,
					buyerViewCount: 1,
					productName: 1,
				},
			},
		]
		const mostViewProducts = await Product.aggregate(similarProductPipline)
		// similar products
		const similarProducts = await Product.find({
			category: { $in: category },
		}).select('productName discount productImage productPrice')
		// 	//Most viewed Products

		// const mostViewProducts = await Product.aggregate(similarProductPipline)

		return {
			mostViewProducts,
			similarProducts,
		}
	}

	public async allSliders() {
		// if (!userId) {
		// 	throw Error('Missing user id')
		// }

		const sliders = await Slider.find().limit(6)

		return sliders
	}

	public async SearchProducts(productName: string, page: number = 1) {
		if (!productName) {
			throw Error(Translations.enterProductName('en'))
		}
		// const ProductPipline: PipelineStage[] = [
		// 	{
		// 		$match: {
		// 			$and: [
		// 				{ availabilityStatus: 'active' }, // Added a comma here
		// 				{
		// 					$or: [
		// 						{
		// 							productName: { $regex: `.*${productName}.*`, $options: 'i' },
		// 						},
		// 						{
		// 							description: { $regex: `.*${productName}.*`, $options: 'i' },
		// 						},
		// 						{
		// 							category: {
		// 								$elemMatch: { $regex: `.*${productName}.*`, $options: 'i' },
		// 							},
		// 						},
		// 					],
		// 				},
		// 			],
		// 		},
		// 	},
		// 	{
		// 		$addFields: {
		// 			priceBeforeDiscount: '$productPrice',
		// 			percentageAfterDiscount: {
		// 				$subtract: [100, '$discount'],
		// 			},
		// 		},
		// 	},
		// 	{
		// 		$addFields: {
		// 			productPrice: {
		// 				currency: '$productPrice.currency',
		// 				amount: {
		// 					$multiply: [
		// 						'$productPrice.amount',
		// 						{
		// 							$divide: ['$percentageAfterDiscount', 100],
		// 						},
		// 					],
		// 				},
		// 			},
		// 			priceBeforeDiscount: '$productPrice',
		// 		},
		// 	},
		// ]
		// const searchProducts = await Product.aggregate(ProductPipline).sort({
		// 	createdAt: -1,
		// })

		const searchProducts = await Product.find({
			$and: [
				{ availabilityStatus: 'active' },
				{
					$or: [
						{
							productName: {
								$regex: `.*${productName.trim()}.*`,
								$options: 'i',
							},
						},
						{
							description: {
								$regex: `.*${productName.trim()}.*`,
								$options: 'i',
							},
						},
						{
							category: {
								$elemMatch: {
									$regex: `.*${productName.trim()}.*`,
									$options: 'i',
								},
							},
						},
					],
				},
			],
		})
			.sort({ createdAt: -1 })
			.limit(15)
			.skip((page - 1) * 15)
			.lean()

		const list = searchProducts.map((product) => {
			if (product.discount > 0) {
				const priceAfterDiscount =
					product.productPrice.amount -
					(product.productPrice.amount * product.discount) / 100
				const productWithDiscount = Object.assign(product, {
					discountPrice: priceAfterDiscount,
				})
				return productWithDiscount
			}

			return product
		})

		return list
	}
	public async saveSearchesInHistory(keyWord: string, userId?: ObjectId) {
		console.log(userId)
		if (!userId) {
			console.log(userId)
			return
		}
		await User.findByIdAndUpdate(
			userId,
			{
				$addToSet: { searchHistory: keyWord.trim() },
			},
			{ new: true }
		)
		await User.findByIdAndUpdate(
			userId,
			{
				$push: {
					searchHistory: {
						$each: [],
						$slice: -10,
					},
				},
			},
			{ new: true }
		)

		return
	}

	public async getSearchesHistory(userId: ObjectId) {
		const search = await User.findById(userId).select('searchHistory').lean()
		if (!search) return []
		return search?.searchHistory
	}

	public async addToCart(data: {
		userId: ObjectId
		productId: ObjectId | ObjectId[]
		quantity: number
	}) {
		if (!data.productId) {
			throw new Error('Product is Missing')
		}

		let productIds = Array.isArray(data.productId)
			? data.productId
			: [data.productId]

		const checkProduct = await Product.find({
			_id: { $in: productIds },
		}).lean()

		if (checkProduct.length !== productIds.length) {
			throw new Error('One or more product ids are invalid')
		}

		let userCart = await Cart.findOne({ userId: data.userId })

		if (!userCart) {
			userCart = new Cart({
				userId: data.userId,
				items: [],
			})
		}

		productIds.forEach((productId) => {
			const existingProduct = userCart.items.find(
				(item) => item.product.toString() === productId.toString()
			)

			if (existingProduct) {
				existingProduct.quantity += data.quantity || 1
			} else {
				userCart.items.push({
					product: productId,
					quantity: data.quantity || 1,
				})
			}
		})

		await userCart.save()

		return userCart
	}

	public async deleteSpecificCart(userId: ObjectId, itemId: ObjectId) {
		if (!itemId) throw new Error('invalid Product!!!')
		if (!userId) throw new Error('you are not allowed to do so!!')
		const cart = await Cart.findOne({ userId })
		if (!cart) throw new Error('Not Found!!')
		const updatedCart = await Cart.findByIdAndUpdate(
			cart._id,
			{
				$pull: { items: { product: itemId } },
			},
			{
				new: true,
			}
		)
		return updatedCart
	}

	public async profile(userId: ObjectId) {
		const profile = await User.findById(userId)
			.select('personalInformation credentialDetails.email')
			.lean()
		return profile
	}
	public async uploadIdCard(data: {
		userId: ObjectId
		idCardFront: Object & { path: string }
		idCardBack: Object & { path: string }
	}) {
		if (!data.userId) throw new Error('Invalid User!!')
		if (data.idCardFront && data.idCardBack) {
			const [front, back] = await Promise.all([
				uploadToCloudinary(data.idCardFront.path, 'crazyByRasel/buyer/idCard'),
				uploadToCloudinary(data.idCardBack.path, 'crazyByRasel/buyer/idCard'),
			])

			return await User.findByIdAndUpdate(
				data.userId,
				{
					'personalInformation.idCard.front': front,
					'personalInformation.idCard.back': back,
					'personalInformation.idCard.status': 'pending',
				},
				{ new: true }
			)
				.select('personalInformation')
				.lean()
		}
	}
	public async updateProfile(
		data: IUserModule.IUpdateProfile,
		profilePic: (any & { path: string }) | undefined
	) {
		if (!data.userId) throw new Error('Invalid User!!')

		// Add type
		const updateObject = { userId: data.userId }

		if (profilePic) {
			const imageUrl = await uploadToCloudinary(
				profilePic.path,
				'crazyByRasel/buyer/profilePic'
			)

			if (imageUrl) updateObject['personalInformation.profilePic'] = imageUrl
		}

		if (data.fullName) {
			updateObject['personalInformation.fullName'] = data.fullName
		}
		if (data.phoneNumber) {
			updateObject['personalInformation.phoneNumber'] = data.phoneNumber
		}
		if (data.gender) {
			updateObject['personalInformation.gender'] = data.gender.toLowerCase()
		}
		if (data.DOB) {
			updateObject['personalInformation.dob'] = data.DOB
		}

		if (data.personalAddress) {
			updateObject['personalInformation.personalAddress'] = data.personalAddress
		}

		// Update the profile
		const updatedProfile = await User.findByIdAndUpdate(
			data.userId,
			{ $set: updateObject },
			{ new: true }
		).lean()

		return updatedProfile
	}

	public async prepareGrandTotals(orders: IOrderModule.IOrderObject[]) {
		const grandTotals = orders.reduce(
			(acc, order) => {
				const { subTotal, discount, deliveryPrice, platformFee, grandTotal } =
					order.totals
				acc.subTotal.amount += subTotal.amount
				acc.discount.amount += discount.amount
				acc.deliveryPrice.amount += deliveryPrice.amount
				acc.platformFee.amount += platformFee.amount
				acc.grandTotal.amount += grandTotal.amount
				return acc
			},
			{
				subTotal: { amount: 0, currency: 'USD' },
				discount: { amount: 0, currency: 'USD' },
				deliveryPrice: { amount: 0, currency: 'USD' },
				platformFee: { amount: 0, currency: 'USD' },
				grandTotal: { amount: 0, currency: 'USD' },
			}
		)

		return grandTotals
	}

	private buyNowProcess = async (data: IOrderModule.IBuyNow) => {
		const createdOrders: IOrderModule.IOrderObject[] = []

		// Calculate total order amount
		const orderAmountWithFees = await this.validateBalance({
			userId: data.userId,
			items: data.items,
			deliveryType: data.deliveryType,
		})

		// const platformFee = Number(environments.PLATFORM_FEE_IN_USD)

		// // Calculate other fees
		// const otherFees = deliveryFee + platformFee
		// const orderAmountWithFees = totalOrderAmount + otherFees

		// // Check user balance
		// const foundUser = await User.findById(data.userId, 'wallet').lean()
		// if (foundUser) {
		// 	const userBalance = (foundUser?.wallet?.balance?.amount ?? 0) / 100
		// 	if (userBalance < orderAmountWithFees) {
		// 		throw new Error(`Insufficient account balance. Please add funds.`)
		// 	}
		// }

		// Group items by Seller ID and process each seller
		const sellerWiseProductsMap = new Map<
			string,
			{
				sellerId: string
				products: any[]
				totalPrice: number
				discount: number
				couponId?: string
			}
		>()

		for (const item of data.items) {
			const product = await Product.findById(item.product).lean()
			if (!product) {
				throw new Error('Product not found')
			}

			const seller = await Admin.findById(product.sellerId).lean()
			if (!seller) {
				throw new Error('Seller not found')
			}

			const sellerId = seller._id.toString()
			let sellerData = sellerWiseProductsMap.get(sellerId)

			if (!sellerData) {
				sellerData = {
					sellerId: sellerId,
					products: [],
					totalPrice: 0,
					discount: 0,
				}
				sellerWiseProductsMap.set(sellerId, sellerData)
			}

			const productPrice = product.productPrice.amount
			const discountedPrice =
				productPrice - (productPrice / 100) * product.discount

			sellerData.products.push({
				product: product,
				quantity: item.quantity,
				price: productPrice,
				discountedPrice,
			})
			sellerData.totalPrice += productPrice * item.quantity
			if (item.couponId) {
				sellerData.couponId = item.couponId
			}
		}

		// Process each seller and create orders
		for (const sellerData of sellerWiseProductsMap.values()) {
			const seller = await Admin.findById(sellerData.sellerId).lean()
			if (!seller) {
				throw new Error('Seller not found')
			}

			const pickupSecret =
				data.deliveryType === 'pickup'
					? Math.floor(Math.random() * 900000 + 100000)
					: 0

			let subTotalAmount: IAmount = { amount: 0, currency: 'USD' }
			const preparedItems = sellerData.products.map((productData: any) => {
				const { quantity, discountedPrice, product } = productData
				subTotalAmount.amount += quantity * discountedPrice
				return {
					product: product._id,
					quantity,
					discountedPrice: {
						amount: discountedPrice,
						currency: product.productPrice.currency,
					},
				}
			})

			let couponDiscount: IAmount = { amount: 0, currency: 'USD' }
			if (sellerData.couponId) {
				const coupon = await Coupon.findById(sellerData.couponId)
				if (coupon) {
					couponDiscount = coupon.discountAmount
				}
			}

			const deliveryPrice =
				data.deliveryType === 'pickup'
					? 0
					: Number(environments.DELIVERY_FEE_IN_USD)
			const platformFee = Number(environments.PLATFORM_FEE_IN_USD)
			const grandTotalAmountBeforePlatformFee =
				subTotalAmount.amount - (couponDiscount?.amount ?? 0)

			const grandTotalAmount =
				grandTotalAmountBeforePlatformFee + deliveryPrice + platformFee

			const totals: {
				subTotal: IAmount
				discount: IAmount
				deliveryPrice: IAmount
				platformFee: IAmount
				grandTotal: IAmount
			} = {
				subTotal: subTotalAmount,
				discount: couponDiscount,
				deliveryPrice: { amount: deliveryPrice, currency: 'USD' },
				platformFee: { amount: platformFee, currency: 'USD' },
				grandTotal: { amount: grandTotalAmount, currency: 'USD' },
			}

			const orderData = {
				sellerId: sellerData.sellerId,
				userId: data.userId,
				items: preparedItems,
				shippingAddress: data.shippingAddress,
				name: data.name,
				email: data.email,
				note: data.note,
				pickupAddress: seller?.address ?? null,
				deliveryType: data.deliveryType,
				phone: data.phone,
				pickupSecret,
				statusDetails: [
					{
						statusType: 'confirmed',
						statusDate: new Date(),
						description: 'order placed',
					},
				],
				totals,
			}

			const order = new Order(orderData)
			const savedOrder = await order.save()
			createdOrders.push(savedOrder)

			if (data.cartDelete) {
				for (const product of preparedItems) {
					await this.deletingProductFromCart(data.userId, product.product)
				}
			}
		}

		if (createdOrders.length === 0) {
			throw new Error(
				'Something went wrong. Your order cannot be created. Please try again.'
			)
		}

		return { createdOrders, orderAmountWithFees }
	}

	public async validateBalance(data: {
		userId: ObjectId
		items: { product: string; quantity: number; couponId?: string }[]
		deliveryType: IOrderModule.IOrderObject['deliverType']
	}) {
		let totalOrderAmount = 0

		for (const item of data.items) {
			const product = await Product.findById(item.product)
				.select('productPrice discount')
				.lean()

			if (!product) {
				throw new Error('Product not found')
			}

			const productPrice = product.productPrice.amount
			const discountedPrice =
				productPrice - (productPrice / 100) * product.discount
			totalOrderAmount += discountedPrice * item.quantity

			if (item.couponId) {
				const coupon = await Coupon.findById(item.couponId).lean()
				if (coupon) {
					if (coupon.discountType === 'percentage') {
						totalOrderAmount -=
							(discountedPrice * item.quantity * coupon.discountAmount.amount) /
							100
					}

					if (coupon.discountType === 'fixed') {
						totalOrderAmount -= coupon.discountAmount.amount * item.quantity
					}
				}
			}
		}

		if (totalOrderAmount < 0) {
			throw new Error('Invalid order amount')
		}

		const deliveryFee =
			data.deliveryType === 'delivery'
				? Number(environments.DELIVERY_FEE_IN_USD)
				: 0

		const platformFee = Number(environments.PLATFORM_FEE_IN_USD)

		const otherFees = deliveryFee + platformFee

		totalOrderAmount += otherFees

		const foundUser = await User.findById(data.userId, 'wallet').lean()

		if (foundUser) {
			const userBalance = (foundUser?.wallet?.balance?.amount ?? 0) / 100
			if (userBalance < totalOrderAmount) {
				throw new Error(`Insufficient account balance. Please add funds.`)
			}
		}

		return totalOrderAmount
	}

	public async deletingProductFromCart(userId: ObjectId, productId: ObjectId) {
		if (!productId) {
			throw Error('Missing productId')
		}

		const cart = await Cart.findOneAndUpdate(
			{ userId },
			{ $pull: { items: { product: productId } } },
			{ new: true }
		)

		if (!cart) {
			return
		}
	}
	public async getOrderById(orderId: string, userId: ObjectId) {
		if (!orderId) throw new Error('invalid product!!')
		const order = await Order.findOne({ _id: orderId, userId })
			.populate('items.product')
			.lean()
		if (!order) throw new Error('order not found')
		return order
	}

	public async createOrder(data: IOrderModule.IBuyNow) {
		const { createdOrders } = await this.buyNowProcess(data)
		const grandTotals = await this.prepareGrandTotals(createdOrders)
		return { createdOrders, grandTotals }
	}
	public async updateUserWalletBalance(
		userId: ObjectId,
		orderTotalAmount: number,
		orderId: ObjectId
	) {
		const amountToMinus = orderTotalAmount * 100
		await User.findByIdAndUpdate(userId, {
			$inc: {
				'wallet.balance.amount': -amountToMinus,
			},
		}).lean()

		//creating transaction for outgoing
		const createTransaction: ITransactionModule.CreateTransaction = {
			userId,
			type: 'outgoing',
			title: 'Order Created Successfully',
			price: { amount: orderTotalAmount, currency: 'USD' },
			description: 'Purchased Some Products',
			orderId,
		}
		await Transaction.create(createTransaction)
	}

	public async createSquareAccount(userId: string) {
		const user = await User.findById(userId)
		if (user) {
			if (user.wallet.square.squareId) {
				return user.wallet
			}

			const squareId = await createSquareAccount({
				givenName: user.personalInformation.fullName,
				email: user.credentialDetails.email,
				reference_id: user?._id.toString(),
				note: `customer created for TigerIT app with tigerIT id ${user._id.toString()}`,
			})

			user.wallet.square.squareId = squareId
			await user.save()
			return user.wallet
		}
	}
	public async topup(
		amount: number,
		currency: string,
		cnon: string,
		userId: string
	) {
		const user = await User.findById(userId)

		if (user) {
			const payment = await processPayment(amount, currency, cnon, userId)

			if (payment.payment.status) {
				const amountInCents = amount * 100
				user.wallet.balance.amount += amountInCents

				await user.save()
				// creating transaction record
				const createTransaction: ITransactionModule.CreateTransaction = {
					userId: userId,
					type: 'incoming',
					title: 'Topup',
					price: { amount, currency: 'USD' },
					description: 'topup added',
				}
				await Transaction.create(createTransaction)

				return { balance: user.wallet.balance }
			}

			return
		}
	}
	public async allBuyerOrders(userId: ObjectId, page: number = 1) {
		const orders = await Order.find({ userId })
			.limit(20)
			.skip((page - 1) * 20)
			.populate('items.product')

		return orders
	}

	public async addToFavorite(userId: ObjectId, productId: ObjectId) {
		// will continue tomorrow
		if (!productId) {
			throw Error('Missing product id')
		}

		const checkProduct = await Product.findById(productId).lean()

		if (!checkProduct) {
			throw Error('Invalid product id. Product not found')
		}

		return await Product.findByIdAndUpdate(
			productId,
			{
				$addToSet: {
					favoriteOf: userId,
				},
			},
			{
				new: true,
			}
		)
	}

	public async buyerRemoveFromFavorite(userId: ObjectId, productId: ObjectId) {
		if (!userId) {
			throw Error(Translations.jwtTokenNotFound('en'))
		}
		const product = await Product.findById(productId)
		if (!product) {
			throw Error('product Not found')
		}

		return await Product.findByIdAndUpdate(
			productId,
			{
				$pull: { favoriteOf: userId },
			},
			{ new: true }
		)
	}

	public async allFavoriteProducts(userId: ObjectId, page: number = 1) {
		if (!userId) {
			throw Error('Missing user id')
		}
		// const ProductPipline: PipelineStage[] = [
		// 	{
		// 		$sort: {
		// 			updatedAt: -1,
		// 		},
		// 	},
		// 	{
		// 		$match: {
		// 			favoriteOf: { $in: userId },
		// 		},
		// 	},
		// 	{
		// 		$addFields: {
		// 			priceBeforeDiscount: '$productPrice',
		// 			percentageAfterDiscount: {
		// 				$subtract: [100, '$discount'],
		// 			},
		// 		},
		// 	},
		// 	{
		// 		$addFields: {
		// 			productPrice: {
		// 				currency: '$productPrice.currency',
		// 				amount: {
		// 					$multiply: [
		// 						'$productPrice.amount',
		// 						{
		// 							$divide: ['$percentageAfterDiscount', 100],
		// 						},
		// 					],
		// 				},
		// 			},
		// 			priceBeforeDiscount: '$productPrice',
		// 		},
		// 	},
		// ]
		// const favorites = await Product.aggregate(ProductPipline)
		//-----------------------------------------------------------------
		// const favorites = await Product.find({ favoriteOf: { $in: userId } }).sort({
		// 	updatedAt: -1,
		// })

		// const favorites = await Product.find({ favoriteOf: userId })
		// 	.limit(20)
		// 	.skip((page - 1) * 20)
		const productAggregation: PipelineStage[] = [
			{ $match: { favoriteOf: userId } },
			{ $sort: { _id: 1 } },
			{ $skip: (page - 1) * 20 },
			{ $limit: 20 },
			{ $unwind: '$category' },
			{
				$group: {
					_id: '$category',
					products: {
						$push: {
							_id: '$_id',
							productName: '$productName',
							productPrice: '$productPrice',
							discount: '$discount',
							productImage: '$productImage',
							description: '$description',
							quantity: '$quantity',
							featured: '$featured',
							promoted: '$promoted',
							videos: '$videos',
							images: '$images',
							highlights: '$highlights',
							whatInsideTheBox: '$whatInsideTheBox',
							color: '$color',
							sellerId: '$sellerId',
							subCategory: '$subCategory',
							stockStatus: '$stockStatus',
							availabilityStatus: '$availabilityStatus',
							rating: '$rating',
							tag: '$tag',
							buyerViewCount: '$buyerViewCount',
							ingredients: '$ingredients',
							dietary: '$dietary',
							category: '$category',
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					category: '$_id',
					products: 1,
				},
			},
		]
		const favorites = await Product.aggregate(productAggregation)
		return favorites
	}

	public async setBuyerDeliveryAddress(
		deliverAddress: IUserModule.IBuyerAccount['deliverAddress'],
		userId: ObjectId
	) {
		if (!deliverAddress) {
			throw Error('Missing Buyer Delivery Address')
		}

		const buyer = await User.findByIdAndUpdate(
			userId,
			{
				$addToSet: {
					'buyerAccount.deliverAddress': deliverAddress,
				},
			},
			{
				new: true,
			}
		)

		if (!buyer) {
			throw Error('Invalid user.Not found')
		}

		return buyer
	}

	public async getBuyerAddresses(userId: ObjectId) {
		const buyerAddresses = await User.findOne({
			_id: userId,
			'buyerAccount.deliverAddress': { $exists: true, $not: { $size: 0 } },
		}).select('buyerAccount')

		if (!buyerAddresses) {
			return 'Address Not Found'
		}

		return buyerAddresses
	}

	// public async addNewPaymentCard(
	// 	userId: ObjectId,
	// 	paymentMethod: IUserModule.IPaymentMethod
	// ) {
	// 	if (!paymentMethod) {
	// 		return 'Not Any Payment Card found'
	// 	}

	// 	const cardNumber = paymentMethod.cardNumber

	// 	const checkCard = await User.findOne({
	// 		_id: userId,
	// 		paymentMethods: {
	// 			$elemMatch: {
	// 				cardNumber,
	// 			},
	// 		},
	// 	})

	// 	if (checkCard) {
	// 		throw Error('You already have added this card')
	// 	}

	// 	const buyer = await User.findByIdAndUpdate(
	// 		userId,
	// 		{
	// 			$addToSet: {
	// 				paymendMethods: paymentMethod,
	// 			},
	// 		},
	// 		{
	// 			new: true,
	// 		}
	// 	).select('buyerAccount')

	// 	return buyer
	// }
	public async getAllCardsBuyer(userId: ObjectId) {
		const buyerCards = await User.findOne({
			_id: userId,
			'buyerAccount.paymentMethods': { $exists: true, $not: { $size: 0 } },
		}).select('buyerAccount')

		if (!buyerCards) {
			return 'Card Not Found'
		}

		return buyerCards
	}
	// public async subscribeUs(data: ISubscriberModel.ISubscriber) {
	// 	const checkSubscriber = await Subscriber.findOne({ email: data.email })
	// 	if (checkSubscriber) {
	// 		return {
	// 			checkSubscriber,
	// 			message: 'you are already subscribed!',
	// 			icon: ConfigVars.alreadySubscribed,
	// 		}
	// 	}
	// 	const subscriber = await Subscriber.create(data)
	// 	if (data.subscriptions === 'gasstation') {
	// 		const stations = await GasStations.find({
	// 			owner: '65ae609b683e083df370a4cb',
	// 		}).lean()
	// 		const htmlContent = ` <!DOCTYPE html>
	// 		<html lang="en">
	// 			<head>
	// 				<meta charset="UTF-8" />
	// 				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	// 				<title>Visit Our Store</title>
	// 				<style>
	// 					body {
	// 						font-family: Arial, sans-serif;
	// 						background-color: #f8f8f8;
	// 						color: #333333;
	// 						margin: 0;
	// 						padding: 0;
	// 					}
	// 					.container {
	// 						width: 100%;
	// 						max-width: 600px;
	// 						margin: 0 auto;
	// 						background-color: #ffffff;
	// 						padding: 20px;
	// 						box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	// 					}
	// 					.header {
	// 						text-align: center;
	// 						padding: 10px 0;
	// 					}
	// 					.header h1 {
	// 						margin: 0;
	// 						color: #62be12;
	// 					}
	// 					.content {
	// 						margin: 20px 0;
	// 					}
	// 					.content p {
	// 						line-height: 1.6;
	// 					}
	// 					.table-container {
	// 						margin: 20px 0;
	// 					}
	// 					table {
	// 						width: 100%;
	// 						border-collapse: collapse;
	// 					}
	// 					th,
	// 					td {
	// 						padding: 10px;
	// 						text-align: center;
	// 						border: 1px solid #dddddd;
	// 					}
	// 					th {
	// 						background-color: #62be12;
	// 						color: #ffffff;
	// 					}
	// 					.cta {
	// 						text-align: center;
	// 						margin: 20px 0;
	// 					}
	// 					.cta a {
	// 						background-color: #62be12;
	// 						color: #ffffff;
	// 						padding: 10px 20px;
	// 						text-decoration: none;
	// 						border-radius: 5px;
	// 						font-size: 16px;
	// 					}
	// 					.footer {
	// 						text-align: center;
	// 						margin-top: 20px;
	// 						font-size: 12px;
	// 						color: #777777;
	// 					}
	// 					.logo img {
	// 						max-width: 50px;
	// 						height: auto;
	// 					}
	// 				</style>
	// 			</head>
	// 			<body>
	// 				<div class="container">
	// 					<div class="header">
	// 						<h1>Welcome to Crazy By Rasel!</h1>
	// 					</div>
	// 					<div class="content">
	// 						<p>Dear Valued Customer,</p>
	// 						<p>
	// 							We are thrilled to invite you to visit our store, where you will find
	// 							the best prices within a 100-mile radius. Our wide selection of
	// 							products ensures that you will find exactly what you need, all at
	// 							unbeatable prices.
	// 						</p>
	// 						<p>
	// 							At Crazy By Rasel, we pride ourselves on offering top-notch quality
	// 							and exceptional customer service. Whether you are shopping for
	// 							essentials or looking for something special, our friendly staff is
	// 							here to assist you.
	// 						</p>
	// 					</div>
	// 					<div class="table-container">
	// 						<table>
	// 							<tr>
	// 								<th>Company</th>
	// 								<th>Old Price</th>
	// 								<th>New Price</th>
	// 							</tr>
	// 							<tr>
	// 								<td class="logo">
	// 									<a href="https://crazybyrasel.com/" target="_blank">
	// 										<img src="${stations[0].logo}" alt="Company 1 Logo" />
	// 									</a>
	// 								</td>
	// 								<td>${stations[0].oldPrice.amount}</td>
	// 								<td>${stations[0].currentPrice.amount}</td>
	// 							</tr>
	// 							<tr>
	// 								<td class="logo">
	// 									<a href="https://crazybyrasel.com/" target="_blank">
	// 										<img src="${stations[1].logo}" alt="Company 2 Logo" />
	// 									</a>
	// 								</td>
	// 								<td>${stations[1].oldPrice.amount}</td>
	// 								<td>${stations[1].currentPrice.amount}</td>
	// 							</tr>
	// 							<tr>
	// 								<td class="logo">
	// 									<a href="https://crazybyrasel.com/" target="_blank">
	// 										<img src="${stations[2].logo}" alt="Company 3 Logo" />
	// 									</a>
	// 								</td>
	// 								<td>${stations[2].oldPrice.amount}</td>
	// 								<td>${stations[2].currentPrice.amount}</td>
	// 							</tr>
	// 						</table>
	// 					</div>
	// 					<div class="cta">
	// 						<a href="https://crazybyrasel.com/" target="_blank">Visit Our Store Today!</a>
	// 					</div>
	// 					<div class="footer">
	// 						<p>&copy; 2024 Crazy By Rasel. All rights reserved.</p>
	// 					</div>
	// 				</div>
	// 			</body>
	// 		</html>

	// 		`
	// 		await sendEmail({
	// 			from: environments.Mail,
	// 			to: data.email,
	// 			subject: 'One More chance for Extra Savings!',
	// 			html: htmlContent,
	// 		})
	// 	}
	// 	return subscriber
	// }
}
export default new buyerRepository()
