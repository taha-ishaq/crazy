import mongoose, { Schema } from 'mongoose'
import { IContactUsModel } from './interface/IContactRequests.js'

const ContactUsModel = new Schema<IContactUsModel.IContactUs>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
		},
		phone: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)
export default mongoose.model('ContactUsRequests', ContactUsModel)
