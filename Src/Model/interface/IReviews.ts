import { ObjectId } from 'mongoose'

export declare module IReviewModel {
	interface IReview extends Document {
		rating: number
		name: string
		description: string
		image: string
		productId: ObjectId | string
		userId: ObjectId
		orderId: ObjectId | string
	} //this is review interface
	interface IReviewCreate {
		rating: number
		name: string
		description: string
		productId: ObjectId | string
		userId: ObjectId
		orderId: ObjectId | string
	}
}
