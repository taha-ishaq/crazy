import { ObjectId } from 'mongoose'
import { IReviewModel } from '../Model/interface/IReviews.js'
import Order from '../Model/orderModel.js'
import Product from '../Model/Product.Model.js'
import reviewModel from '../Model/reviewModel.js'

class reviewRepository {
	public async create(data: IReviewModel.IReviewCreate) {
		if (!data) throw new Error('Invalid data input')
		const [product, order] = await Promise.all([
			Product.findById(data.productId).lean(),
			Order.findById(data.orderId).lean(),
		])
		const isReviewed = await reviewModel.findOne({
			orderId: data.orderId,
			productId: data.productId,
		})
		if (
			isReviewed ||
			!product ||
			!order ||
			order.orderStatus !== 'delivered' ||
			order.userId.toString() !== data.userId.toString()
		) {
			throw new Error('Invalid product, order, or status')
		}

		const isProductInOrder = order.items.some(
			(item) => item.product.toString() === data.productId.toString()
		)
		if (!isProductInOrder) throw new Error('Invalid product!')

		data['image'] = product.productImage

		const review = await reviewModel.create(data)
		await Product.findByIdAndUpdate(data.productId, {
			$inc: {
				'rating.totalRating': review.rating,
				'rating.numRating': 1,
			},
		})

		return review
	}

	public async getReviews() {
		const reviews = await reviewModel.find().lean()
		return reviews
	}
	public async getReviewsByProductId(id: string | ObjectId) {
		const reviews = await reviewModel.find({ productId: id }).lean()
		return reviews
	}
}
export default new reviewRepository()
