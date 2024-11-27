import mongoose, { Schema } from 'mongoose'
import { ICartModule } from './interface/ICart.js'

const cartSchema: Schema<ICartModule.ICartObject> =
	new mongoose.Schema<ICartModule.ICartObject>({
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			unique: true,
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
			},
		],
	})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
