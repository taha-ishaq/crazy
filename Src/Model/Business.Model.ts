import mongoose, { Schema } from 'mongoose'
import { IBusinessModels } from './interface/IBusiness.js'

const BusinessModel = new Schema<IBusinessModels.IBusiness>(
	{
		title: {
			type: String,
		},
		description: { type: String },
		website: { type: String },
		icon: { type: String },
		offersGas: { type: Boolean, default: false },
		gasPrice: {
			amount: {
				type: Number,
			},
			currency: {
				type: String,
			},
		},
		address: { type: String },
		owner: { type: Schema.Types.ObjectId },
	},
	{ timestamps: true }
)

export default mongoose.model('Business', BusinessModel)
