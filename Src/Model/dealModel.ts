import mongoose, { Schema } from 'mongoose'
import { IDealModule } from './interface/IDeals'

const dealSchema: Schema<IDealModule.IDealObject> =
	new mongoose.Schema<IDealModule.IDealObject>({
		name: {
			type: String,
			required: false,
		},
		image: {
			type: String,
			required: true,
		},
	})

const Deal = mongoose.model('Deal', dealSchema)
export default Deal
