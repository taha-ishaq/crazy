import mongoose, { Schema } from 'mongoose'
import { ISubscriberModel } from './interface/ISubscribers'
const subscribeSchema: Schema<ISubscriberModel.ISubscribe> =
	new mongoose.Schema<ISubscriberModel.ISubscribe>(
		{
			email: {
				type: String,
				required: true,
				lowercase: true,
			},
			name: {
				type: String,
				required: false,
			},
			subscriptions: {
				type: String,
				enum: ['gasstation', 'offers'],
				default: 'gasstation',
			},
		},
		{ timestamps: true }
	)
const Subscriber = mongoose.model('Subscriber', subscribeSchema)
export default Subscriber
