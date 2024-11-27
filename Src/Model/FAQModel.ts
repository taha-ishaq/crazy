import mongoose, { Schema } from 'mongoose'
import { IFAQsModel } from './interface/IFAQs.js'
const FAQsModel = new Schema<IFAQsModel.IFAQ>({
	question: {
		type: String,
		required: true,
	},
	answer: {
		type: String,
		required: true,
	},
	// admin: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'User',
	// 	required: true,
	// },
})
const FAQ = mongoose.model('FAQ', FAQsModel)
export default FAQ
