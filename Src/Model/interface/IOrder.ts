import { Document, ObjectId } from 'mongoose'
import { IAmount } from './IAmount'

export declare namespace IOrderModule {
	interface Iitems {
		product: ObjectId
		quantity: number
		discountedPrice: IAmount
	}
	interface IOrderObject extends Document {
		_id: ObjectId
		userId: ObjectId
		items: Iitems[]
		shippingAddress: IAddress
		orderStatus: string
		sellerId: ObjectId
		name: string
		email: string
		note: string
		deliverType: 'delivery' | 'pickup'
		phone: string
		couponId?: string
		rating: IRating
		totals: {
			subTotal: IAmount
			discount: IAmount
			deliveryPrice: IAmount
			platformFee: IAmount
			grandTotal: IAmount
		}
	}

	interface CreateOrder {
		shippingAddress: IAddress
		userId: ObjectId
		name: string
		email: string
		note: string
		cartDelete: boolean
		deliveryType: 'delivery' | 'pickup'
		phone: string
	}

	interface IBuyNow extends CreateOrder {
		items: { product: string; quantity: number; couponId?: string }[]
	}
	interface IRating {
		avgRat: number
		totalRating: number
	}
}
