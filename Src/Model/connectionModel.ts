import mongoose, { Schema } from 'mongoose'
import { IConnectionModels } from './interface/IConnections.js'

const connectionModel = new Schema<IConnectionModels.Iconnection>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, lowercase: true },
		phoneNumber: { type: String },
		message: { type: String, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model('Connection', connectionModel)
