import { Document, ObjectId } from 'mongoose'

export declare module ITransactionModule {
	interface CreateTransaction {
		userId: ObjectId | string
		type: 'incoming' | 'outgoing'
		price: {
			amount: number
			currency: string
		}
		description: string
		orderId?: ObjectId
		withdrawalId?: ObjectId | string
		title: string
	}
	interface doc extends Document {
		userId: ObjectId
		type: 'incoming' | 'outgoing'
		price: {
			amount: number
			currency: string
		}
		description: string
		orderId?: ObjectId
		withdrawalId?: ObjectId
		title: string
	}
}
