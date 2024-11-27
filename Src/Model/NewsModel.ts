import mongoose, { Schema } from 'mongoose'
import { INewsModel } from './interface/INews.js'

const NewsModel = new Schema<INewsModel.INews>(
	{
		business: {
			type: String,
		},
		description: {
			type: String,
		},
		image: {
			type: String,
		},
		title: {
			type: String,
		},
	},
	{ timestamps: true }
)
export default mongoose.model('News', NewsModel)
