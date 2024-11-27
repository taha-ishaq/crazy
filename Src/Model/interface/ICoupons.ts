import { Document, ObjectId } from 'mongoose'
import { IAmount } from './IAmount.js'

export declare module ICouponModule {
	interface ICoupon extends Document {
		title: string
		subTitle?: string
		code: string
		logo: string
		discountType: 'percentage' | 'fixed'
		discountAmount: IAmount
		minimumPurchaseAmount: IAmount
		expirationDate: Date
		active: boolean
		category?: string
		creator: {
			type: string
			id: ObjectId
			user?: {
				title: string
				image: string
				category: string
			}
			icon: string
		}
		createdAt: Date
		updatedAt: Date

		/**
		 * @description
		 * This is the user who can use the coupon, if not provided, it means the coupon is for all users
		 */
		userId?: ObjectId
	}

	interface Create {
		title: string
		subTitle?: string
		discountType: 'percentage' | 'fixed'
		discountAmount: IAmount
		minimumPurchaseAmount: IAmount
		expirationDate: Date
		count: number
		category?: string
		code?: string

		/**
		 * @description
		 * This is creator of the coupon, if not provided, it means the coupon is created by the default admin
		 */
		creator?: {
			type: string
			id: ObjectId
			icon: string
		}

		/**
		 * @description
		 * This is the user who can use the coupon, if not provided, it means the coupon is for all users
		 */
		userId?: ObjectId
	}
}
