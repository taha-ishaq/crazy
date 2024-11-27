import mongoose, { Schema } from 'mongoose'
import { IProductModule } from './interface/IProduct.js'

const productSchema: Schema<IProductModule.Model> =
	new mongoose.Schema<IProductModule.Model>(
		{
			name: {
				type: String,
				trim: true,
				required: [true, 'Please provide product name'],
			},
			productName: {
				type: String,
				trim: true,
			},
			productPrice: {
				amount: {
					type: Number,
				},
				currency: {
					type: String,
				},
			},
			price: {
				amount: {
					type: Number,
				},
				currency: {
					type: String,
				},
			},
			discount: {
				type: Number,
				max: 100,
				min: 0,
				default: 0,
			},
			productImage: {
				type: String,
			},
			description: {
				type: String,
				trim: true,
			},
			quantity: {
				type: Number,
				required: [true, 'Please specify available product quantity in stocks'],
			},
			featured: {
				type: Boolean,
				default: false,
			},
			promoted: {
				type: Boolean,
				default: false,
			},
			videos: {
				type: [String],
			},
			images: {
				type: [String],
			},

			businessId: {
				type: mongoose.Types.ObjectId,
				ref: 'Business',
				required: [true, 'Please provide business id'],
			},
			highlights: {
				type: [String],
			},
			whatInsideTheBox: {
				type: String,
			},
			color: {
				type: String,
			},
			sellerId: {
				type: mongoose.Types.ObjectId,
				ref: 'Admin',
			},
			category: {
				type: [String],
			},
			subCategory: {
				type: [String],
			},
			stockStatus: {
				type: Boolean,
				default: true,
			},
			availabilityStatus: {
				type: String,
				enum: ['active', 'inactive', 'rejected', 'deleted'],
				default: 'active',
			},
			rating: {
				totalRating: {
					type: Number,
					default: 0,
				},
				numRating: {
					type: Number,
					default: 0,
				},
			},
			// productType: {
			// 	type: String,
			// 	enum: ['food', 'item'],
			// },
			tag: {
				type: [String],
				enum: ['topDeal', 'bestSeller'],
			},
			favoriteOf: {
				type: [mongoose.Schema.Types.ObjectId],
				ref: 'User',
				select: false,
			},
			buyerViewCount: {
				type: Number,
				default: 0,
			},
			ingredients: {
				type: String,
			},
			dietary: {
				String,
			},
		},
		{
			timestamps: true,
		}
	)

const Product = mongoose.model<IProductModule.Model>('Product', productSchema)
export default Product
