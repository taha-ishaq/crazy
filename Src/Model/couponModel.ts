import mongoose, { Schema } from 'mongoose'
import { ICouponModule } from './interface/ICoupons.js'

const couponSchema: Schema<ICouponModule.ICoupon> =
	new mongoose.Schema<ICouponModule.ICoupon>(
		{
			title: {
				type: String,
				required: true,
			},
			subTitle: {
				type: String,
				required: false,
			},
			code: {
				type: String,
				required: true,
				unique: true,
			},
			discountType: {
				type: String,
				enum: ['percentage', 'fixed'],
				default: 'fixed',
			},
			discountAmount: {
				amount: {
					type: Number,
					required: true,
				},
				currency: {
					type: String,
					default: 'USD',
				},
			},
			logo: {
				type: String,
				required: false,
			},
			minimumPurchaseAmount: {
				amount: { type: Number, default: 0 },
				currency: { type: String, default: 'USD' },
			},
			expirationDate: {
				type: Date,
				required: true,
			},
			active: {
				type: Boolean,
				default: true,
			},
			category: { type: String, required: false },
			creator: {
				type: {
					type: String,
					enum: ['admin'],
					required: true,
				},
				id: {
					type: Schema.Types.ObjectId,
					required: true,
				},
				icon: {
					type: String,
				},
			},
			userId: {
				type: Schema.Types.ObjectId,
				required: false,
				ref: 'User',
			},
		},
		{
			timestamps: true,
		}
	)

// mongoose middleware which will run before saving the document into the database

const Coupon = mongoose.model<ICouponModule.ICoupon>('Coupon', couponSchema)

export default Coupon
