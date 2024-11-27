import { Request, Response } from 'express'
import CategoryEnums from '../Enums/CategoryEnums.js'
import { IUserModule } from '../Model/interface/IUser.js'
import buyerRepository from '../Repositories/buyerRepository.js'
import CategoryRepository from '../Repositories/CategoryRepository.js'
import ProductRepo from '../Repositories/ProductRepo.js'
import reviewRepository from '../Repositories/reviewRepository.js'
import IntlUtil from '../utils/IntlUtils.js'
import { returnError } from '../utils/resUtils.js'

const buyerController = {
	buyerHomeData: async (req: Request, res: Response) => {
		try {
			const [
				topCategories,
				bestSellerProducts,
				beverages,
				grocery,
				alcohol,
				snacks,
				petFood,
			] = await Promise.all([
				CategoryRepository.topCategories(),
				ProductRepo.bestSellerProducts(),
				ProductRepo.productsByCategory({
					category: CategoryEnums.beverages,
					page: 1,
					limit: 13,
				}),
				ProductRepo.productsByCategory({
					category: CategoryEnums.grocery,
					page: 1,
					limit: 13,
				}),
				ProductRepo.productsByCategory({
					category: CategoryEnums.alcohol,
					page: 1,
					limit: 13,
				}),
				ProductRepo.productsByCategory({
					category: CategoryEnums.snacks,
					page: 1,
					limit: 13,
				}),
				ProductRepo.productsByCategory({
					category: CategoryEnums.petFood,
					page: 1,
					limit: 13,
				}),
			])

			const data = {
				topCategories,
				bestSellerProducts,

				categoryProducts: [
					{
						category: CategoryEnums.grocery,
						products: IntlUtil.shuffleArray(grocery),
					},
					{
						category: CategoryEnums.beverages,
						products: IntlUtil.shuffleArray(beverages),
					},
					{
						category: CategoryEnums.alcohol,
						products: IntlUtil.shuffleArray(alcohol),
					},
					{
						category: CategoryEnums.snacks,
						products: IntlUtil.shuffleArray(snacks),
					},
					{
						category: CategoryEnums.petFood,
						products: IntlUtil.shuffleArray(petFood),
					},
				],
			}

			return res.status(200).json({
				success: true,
				data,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getAllCategories: async (req: Request, res: Response) => {
		try {
			const { page, limit } = req.query

			// erId = req.user._id

			const categories = await buyerRepository.getAllCategories(
				page as any,
				limit as any
			)

			return res.status(200).json({
				success: true,
				length: categories.length,
				categories,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	productById: async (req: Request, res: Response) => {
		try {
			// const userId = req.user._id
			const productId = req.query.productId

			const product = await buyerRepository.getProductById(productId as string)

			const allSimilarProducts: any[] = []
			const allMostViewProducts: any[] = []

			if (product.category.length > 0) {
				await Promise.all(
					product.category.map(async (categoryName) => {
						const [similarProducts, mostViewProducts] = await Promise.all([
							ProductRepo.productsByCategory({
								category: categoryName,
								page: 1,
								limit: 9,
								currentUserId: req.user?._id,
							}),
							ProductRepo.productsByCategory({
								category: categoryName,
								page: 1,
								limit: 9,
								currentUserId: req.user?._id,
							}),
						])

						allSimilarProducts.push(...similarProducts)
						allMostViewProducts.push(...mostViewProducts)
					})
				)
			}
			const reviews = await reviewRepository.getReviewsByProductId(
				productId as string
			)

			res.status(200).json({
				success: true,
				product,
				reviews,
				similarProducts: allSimilarProducts,
				mostViewProducts: allMostViewProducts,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	orderById: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { orderId } = req.query
			const order = await buyerRepository.getOrderById(
				orderId as string,
				userId
			)

			res.status(200).json({
				success: true,
				order,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getAllSliders: async (req: Request, res: Response) => {
		try {
			// const userId = req.user._id

			const sliders = await buyerRepository.allSliders()

			return res.status(200).json({
				success: true,
				length: sliders.length,
				sliders,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	buyerSearchProduct: async (req: Request, res: Response) => {
		try {
			// Search Product Name
			const userId = req.user?._id
			const { productName, page } = req.query

			const products = await buyerRepository.SearchProducts(
				productName as string,
				page as any
			)

			await buyerRepository.saveSearchesInHistory(productName as string, userId)
			return res.status(200).json({
				success: true,
				length: products.length,
				products,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getSearchesHistory: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const searches = await buyerRepository.getSearchesHistory(userId)
			res.status(200).json({ success: true, data: searches.reverse() })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	addToCart: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id

			const { productId, quantity } = req.body

			const cart = await buyerRepository.addToCart({
				userId,
				productId,
				quantity,
			})

			return res.status(200).json({
				success: true,
				cart,
				message: 'Product has been added successfully',

				cartLength: cart.items.length,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	createOrder: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id

			const {
				items,
				shippingAddress,
				name,
				email,
				note,
				deliveryType,
				phone,
				cartDelete,
			} = req.body

			const { createdOrders, grandTotals } = await buyerRepository.createOrder({
				userId,
				items,
				shippingAddress,
				name,
				email,
				note,
				deliveryType,
				phone,
				cartDelete,
			})

			return res.status(201).json({
				success: true,
				createdOrders,
				grandTotals,
				message: 'Your order has been created Successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	createSquareAccount: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id

			const createdAccount = await buyerRepository.createSquareAccount(
				userId as string
			)
			return res.status(200).json({ createdAccount, success: true })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	topUp: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const { amount, currency, cnon } = req.body
			const responsePayment = await buyerRepository.topup(
				amount,
				currency,
				cnon,
				userId
			)
			return res.status(200).json({
				success: true,
				responsePayment,
				message: `Payment of ${amount} ${currency} has been Added successfully`,
			})
		} catch (error) {
			console.log('error : ', error)
			returnError(req, res, error)
		}
	},

	buyerOrders: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { page } = req.query

			const orders = await buyerRepository.allBuyerOrders(userId, page as any)

			return res.status(200).json({
				success: true,
				length: orders.length,
				orders,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	deleteSpecificProductFromCart: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const { productId } = req.body
			const deleteSpecificCart = await buyerRepository.deleteSpecificCart(
				userId,
				productId
			)
			res.status(200).json({
				success: true,
				deleteSpecificCart,
				message: 'Deleted successfully!',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	orderByStatus: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const { orderStatus, page, limit } = req.query as {
				// deliverType: string
				orderStatus: string
				page: any
				limit: any
			}
			const { orders, totalPages } = await buyerRepository.orderByStatus(
				userId,
				orderStatus,
				Number(page) || 1,
				Number(limit) || 10
			)
			res.status(200).json({ success: true, totalPages, orders })
		} catch (error) {
			returnError(req, res, error)
		}
	},

	addFavorite: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { productId } = req.body

			const favorite = await buyerRepository.addToFavorite(userId, productId)
			// will continue tomorrow

			res.json({
				success: true,
				message: 'Product is Successfully added to favorite',
				favorite,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	profile: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const profile = await buyerRepository.profile(userId)
			res.status(200).json({ success: true, profile })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	updateProfile: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const { fullName, DOB, gender, phoneNumber, personalAddress } = req.body
			const profilePic = req.files
				? req.files['profilePic']
					? req.files['profilePic'][0]
					: ''
				: ''
			const data: IUserModule.IUpdateProfile = { userId }
			if (fullName) data.fullName = fullName
			if (DOB) data.DOB = DOB
			if (gender) data.gender = gender.toLowerCase()
			if (phoneNumber) data.phoneNumber = phoneNumber
			if (personalAddress) data.personalAddress = personalAddress

			const updatedProfile = await buyerRepository.updateProfile(
				data,
				profilePic
			)
			res.status(200).json({
				success: true,
				updatedProfile,
				message: 'Profile has been updated successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	uploadIdCard: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const idCardFront = req.files
				? req.files['idCardFront']
					? req.files['idCardFront'][0]
					: ''
				: ''
			const idCardBack = req.files
				? req.files['idCardBack']
					? req.files['idCardBack'][0]
					: ''
				: ''
			const user = await buyerRepository.uploadIdCard({
				userId,
				idCardFront,
				idCardBack,
			})
			res.status(200).json({
				success: true,
				message: 'ID Card uploaded Successfully!',
				user,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	removeFavorite: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { productId } = req.body

			const product = await buyerRepository.buyerRemoveFromFavorite(
				userId,
				productId
			)

			res.status(200).json({
				success: true,
				product,
				message: 'Product has been removed successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getAllFavoriteProducts: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { page } = req.query

			const products = await buyerRepository.allFavoriteProducts(
				userId,
				page as any
			)

			return res.status(200).json({
				success: true,
				length: products.length,
				products,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	setNewBuyerAddress: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { deliverAddress } = req.body

			const buyer = await buyerRepository.setBuyerDeliveryAddress(
				deliverAddress,
				userId
			)

			return res.status(200).json({
				success: true,
				buyer,
				message: 'Your address has been updated successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getAllBuyerAddresses: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id

			const buyerAddresses = await buyerRepository.getBuyerAddresses(userId)

			return res.status(200).json({
				success: true,
				buyer: buyerAddresses,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	// addNewPaymentCard: async (req: Request, res: Response) => {
	// 	try {
	// 		const userId = req.user._id
	// 		const { paymentMethod } = req.body

	// 		const buyer = buyerRepository.addNewPaymentCard(userId, paymentMethod)

	// 		return res.status(200).json({
	// 			success: true,
	// 			buyer,
	// 			message: 'Your new payment card has been added',
	// 		})
	// 	} catch (error) {
	// 		returnError(req, res, error)
	// 	}
	// },

	getAllCardSpecificBuyer: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id

			const buyer = await buyerRepository.getAllCardsBuyer(userId)

			return res.status(200).json({
				success: true,
				buyer,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default buyerController
