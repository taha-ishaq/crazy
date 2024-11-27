import { Document, ObjectId } from 'mongoose'
import { IAmount } from './IAmount'

export declare module ICartModule {
	interface Iitems {
		product: ObjectId
		quantity: number
	}
	interface ISubTotal {
		title: string
		price: IAmount
	}
	interface ICartObject extends Document {
		userId: ObjectId
		items: Iitems[]
	}

	interface ISubType {
		title: string
		type: 'count' | 'amount'
		count?: number
		price?: IAmount
	}
}

export declare namespace IMyCartResponse {
	interface AggregationRes {
		_id: ObjectId
		businessInfo: {
			_id: ObjectId
			email: string
			fullName: string
			storeName: string
		}
		items: { product: Product; quantity: number }[]
		count: number
	}

	interface Product {
		_id: ObjectId
		businessId: ObjectId
		name: string
		price: IAmount
	}

	interface ISubType {
		title: string
		type: 'amount' | 'count'
		price: IAmount
	}
}
