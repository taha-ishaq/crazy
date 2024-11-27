import mongoose, { Schema } from 'mongoose'
import { IOrderModule } from './interface/IOrder.js'

const orderSchema: Schema<IOrderModule.IOrderObject> =
	new mongoose.Schema<IOrderModule.IOrderObject>(
		{
			userId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			sellerId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Admin',
			},

			items: [
				{
					product: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'Product',
					},
					quantity: {
						type: Number,
					},
					discountedPrice: {
						amount: {
							type: Number,
						},
						currency: {
							type: String,
						},
					},
				},
			],

			orderStatus: {
				type: String,
				enum: ['processed', 'assigned', 'delivered', 'confirmed', 'cancelled'],
				default: 'confirmed',
			},
			name: {
				type: String,
			},
			email: {
				type: String,
				lowercase: true,
			},
			note: {
				type: String,
			},

			shippingAddress: {
				formattedAddress: {
					type: String,
				},
				isoCode: {
					type: String,
				},
				longitude: {
					type: Number,
				},
				latitude: {
					type: Number,
				},
				country: {
					type: String,
				},
				state: {
					type: String,
				},
				city: {
					type: String,
				},
				type: {
					type: String,
					enum: ['Point'],
				},
				coordinates: {
					type: [Number],
					index: '2dsphere',
				},
			},
			deliverType: {
				type: String,
				enum: ['delivery', 'pickup'],
				default: 'delivery',
			},
			phone: {
				type: String,
			},

			couponId: { type: String, required: false },
			totals: {
				subTotal: {
					amount: {
						type: Number,
						default: 0,
					},
					currency: {
						type: String,
						default: 'USD',
					},
				},
				discount: {
					amount: {
						type: Number,
						default: 0,
					},
					currency: {
						type: String,
						default: 'USD',
					},
				},
				platformFee: {
					amount: {
						type: Number,
						default: 0.5,
					},
					currency: {
						type: String,
						default: 'USD',
					},
				},
				deliveryPrice: {
					amount: {
						type: Number,
						default: 1,
					},
					currency: {
						type: String,
						default: 'USD',
					},
				},
				grandTotal: {
					amount: {
						type: Number,
						default: 0,
					},
					currency: {
						type: String,
						default: 'USD',
					},
				},
			},
		},
		{
			timestamps: true,
		}
	)

const Order = mongoose.model('Order', orderSchema)

export default Order
