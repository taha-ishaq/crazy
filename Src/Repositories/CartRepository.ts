import { ObjectId, PipelineStage } from 'mongoose'
import environments from '../config/environments.js'
import Cart from '../Model/Cart.Model.js'
import Coupon from '../Model/couponModel.js'
import { IAmount } from '../Model/interface/IAmount.js'
import { ICartModule, IMyCartResponse } from '../Model/interface/ICart.js'
import { IOrderModule } from '../Model/interface/IOrder.js'
import Product from '../Model/Product.Model.js'

class CartRepository {
	public async optimizedCart(
		userId: ObjectId,
		couponsData?: { sellerId: string; couponId: string }[]
	) {
		// Step 1: Aggregation Pipeline to fetch and compute cart details
		const cartAggregation = await this.myCartAggregation(userId)

		// Calculate subTotal for total order
		let orderSubTotal = {
			amount: 0,
			currency: 'USD',
		}

		// Calculate discount for total order
		let orderDiscount = {
			amount: 0,
			currency: 'USD',
		}

		await Promise.all(
			cartAggregation.map(async (doc) => {
				let subTotalAmount = 0

				for (const item of doc.items) {
					subTotalAmount += item.product.price.amount * item.quantity
				}

				// Calculate subTotal for the business
				const subTotal: IAmount = {
					amount: subTotalAmount,
					currency: 'USD',
				}

				const total: ICartModule.ISubType[] = [
					{
						title: 'Sub Total',
						type: 'amount',
						price: subTotal,
					},
				]

				const couponData = couponsData?.find(
					(coupon) => coupon.sellerId === doc.businessInfo._id.toString()
				)

				if (couponData) {
					const coupon = await Coupon.findById(couponData.couponId)

					if (coupon) {
						let discountAmount = 0

						if (coupon.discountType === 'percentage') {
							discountAmount =
								subTotalAmount * (coupon.discountAmount.amount / 100)
						}

						if (coupon.discountType === 'fixed') {
							discountAmount = coupon.discountAmount.amount
						}

						total.push({
							title: 'Discount',
							type: 'amount',
							price: {
								amount: discountAmount * -1,
								currency: 'USD',
							},
						})

						if (discountAmount > 0) {
							orderDiscount.amount -= discountAmount
						}

						total.push({
							title: 'Total',
							type: 'amount',
							price: {
								amount: subTotalAmount - discountAmount,
								currency: 'USD',
							},
						})
					}
				}

				orderSubTotal.amount += subTotalAmount

				// delivery time (static for now)
				const deliveryTime = new Date()
				deliveryTime.setDate(deliveryTime.getDate() + 5)
			})
		)

		// Step 2: Calculate delivery fee and platform fee
		// delivery fee (static for now)
		const deliveryFeeAmount = Number(environments.DELIVERY_FEE_IN_USD)
		// platform fee (static for now)
		const platformFeeAmount = Number(environments.PLATFORM_FEE_IN_USD)

		const deliveryFee: IAmount = {
			amount: deliveryFeeAmount,
			currency: 'USD',
		}

		const platformFee: IAmount = {
			amount: platformFeeAmount,
			currency: 'USD',
		}

		// Step 3: Calculate total count of products

		//  Prepare totalAmounts for order
		let totalOrderAmounts: IMyCartResponse.ISubType[] = []

		totalOrderAmounts.push({
			title: 'Sub Total',
			type: 'amount',
			price: orderSubTotal,
		})

		if (orderDiscount.amount < 0) {
			totalOrderAmounts.push({
				title: 'Discount',
				type: 'amount',
				price: orderDiscount,
			})
		}

		totalOrderAmounts.push({
			title: 'Delivery Fee',
			type: 'amount',
			price: deliveryFee,
		})

		totalOrderAmounts.push({
			title: 'Platform Fee',
			type: 'amount',
			price: platformFee,
		})

		const updatedCart = {
			details: cartAggregation,
			total: totalOrderAmounts,
			orderTotal: {
				price: {
					amount:
						orderSubTotal.amount +
						deliveryFee.amount +
						platformFee.amount +
						orderDiscount.amount,
					currency: 'USD',
				},
				type: 'amount',
				title: 'Order Total',
			},
			totalCount: 1,
		}

		return updatedCart
	}

	public async updateBuyerCart(
		userId: ObjectId,
		items: { product: string; quantity: number }[],
		couponInfo?: {
			sellerId: string
			couponId: string
		}[]
	) {
		if (!items || items.length === 0) {
			await Cart.findOneAndDelete({ userId })
			const optimizedCartInfo = {
				details: [],
			}
			return optimizedCartInfo
		}

		if (!Array.isArray(items)) {
			throw new Error('Invalid cart structure')
		}

		await Cart.findOneAndUpdate(
			{ userId },
			{
				$set: { items },
			},
			{ new: true, upsert: true }
		)

		const optimizedCartInfo = await this.optimizedCart(
			userId,
			couponInfo ?? undefined
		)

		optimizedCartInfo.details = optimizedCartInfo.details
		// .slice()
		// .sort((a, b) => a.seller.email.localeCompare(b.seller.email))

		return optimizedCartInfo
	}

	public async buyNowItemDetails(query: {
		productId: ObjectId
		quantity: number
		deliveryType: IOrderModule.IOrderObject['deliverType']
	}) {
		const product = await Product.findById(query.productId).lean()

		if (!product) {
			throw new Error('Product not found')
		}

		const deliveryFee = parseInt(environments.DELIVERY_FEE_IN_USD.toString())

		const platformFee = parseInt(environments.PLATFORM_FEE_IN_USD.toString())

		const totals = [
			{
				_id: 'product',
				name: 'Items',
				price: {
					currency: 'USD',
					amount: (product.productPrice.amount ?? 1) * query.quantity,
				},
				quantity: 1,
			},
			{
				_id: 'platformFee',
				name: 'Platform Fee',
				price: { currency: 'USD', amount: platformFee },
				quantity: 1,
			},
		]

		if (query.deliveryType === 'delivery') {
			totals.push({
				_id: 'deliveryFee',
				name: 'Delivery Fee',
				price: { currency: 'USD', amount: deliveryFee },
				quantity: 1,
			})
		}

		const subTotal = totals.reduce((acc, item) => acc + item.price.amount, 0)

		const data = {
			product: {
				_id: product._id,
				name: product.productName,
				price: product.productPrice,
				image: product.productImage,
			},
			totals,
			subtotal: {
				_id: 'subtotal',
				name: 'Subtotal',
				price: { currency: 'USD', amount: subTotal },
				quantity: 1,
			},
		}

		return data
	}

	/// Private

	private async myCartAggregation(userId: ObjectId) {
		const pipeline: PipelineStage[] = [
			{
				$match: { userId },
			},
			{
				$unwind: '$items',
			},
			{
				$lookup: {
					from: 'products',
					localField: 'items.product',
					foreignField: '_id',
					as: 'productInfo',
					pipeline: [
						{
							$project: {
								name: '$productName',
								image: '$productImage',
								businessId: 1,
								price: '$productPrice',
							},
						},
					],
				},
			},
			{
				$unwind: '$productInfo',
			},
			{
				$lookup: {
					from: 'businesses',
					localField: 'productInfo.businessId',
					foreignField: '_id',
					as: 'businessInfo',
				},
			},
			{
				$unwind: '$businessInfo',
			},
			{
				$group: {
					_id: '$productInfo.sellerId',
					businessInfo: {
						$first: '$businessInfo',
					},
					items: {
						$push: {
							product: '$productInfo',
							quantity: '$items.quantity',
						},
					},
					count: {
						$sum: 1,
					},
				},
			},
			{
				$project: {
					_id: 0,
					businessInfo: 1,
					items: 1,
					count: 1,
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
		]

		const cartAggregation =
			await Cart.aggregate<IMyCartResponse.AggregationRes>(pipeline)

		return cartAggregation
	}
}

export default new CartRepository()
