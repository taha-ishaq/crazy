import mongoose, { Schema } from 'mongoose'
import { IReviewModel } from './interface/IReviews.js'

const ReviewModel = new Schema<IReviewModel.IReview>(
	{
		name: {
			type: String,
			required: true,
		},
		rating: {
			type: Number,
			max: 5,
			min: 1,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		productId: {
			type: Schema.Types.ObjectId,
			ref: 'Product',
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Order',
			required: false,
		},
	},
	{ timestamps: true }
)

export default mongoose.model('Review', ReviewModel)
