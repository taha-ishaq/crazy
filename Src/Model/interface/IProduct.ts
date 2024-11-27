import { Document, ObjectId } from 'mongoose'
import { IAmount } from './IAmount.js'

export declare namespace IProductModule {
	interface Model extends Document {
		/**
		 * @deprecated - use name instead
		 */
		productName: string

		name: string
		/**
		 * @deprecated - use name instead
		 */
		productPrice: IAmount
		price: IAmount
		description: string
		productImage: string
		images: string[]
		quantity: number
		featured: boolean
		promoted: boolean
		category: string[]
		subCategory: string[]

		/**
		 * @deprecated - use businessId instead
		 */
		sellerId: ObjectId
		stockStatus: boolean
		videos: string[]
		businessId: ObjectId
		highlights: string[]
		whatInsideTheBox: string
		color: string
		discount: number
		availabilityStatus: string
		rating: {
			totalRating: number
			numRating: number
		}
		tag: String[]
		// productType: string
		// restaurantId: ObjectId
		favoriteOf: ObjectId[]
		buyerViewCount: number
		ingredients: string
		dietary: string
	}
}
