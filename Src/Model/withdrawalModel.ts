import mongoose, { Schema } from 'mongoose'
import { IWithdrawalModule } from './interface/IWithdrawal.js'

const withdrawalSchema: Schema<IWithdrawalModule.IWithdrawalObject> =
	new mongoose.Schema<IWithdrawalModule.IWithdrawalObject>(
		{
			userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
			balance: {
				amount: { type: Number, required: true },
				currency: { type: String, required: true },
			},
			status: {
				type: String,
				enum: ['pending', 'approved'],
				default: 'pending',
			},
			description: { type: String, required: true },
		},
		{
			timestamps: true,
		}
	)

export default mongoose.model<IWithdrawalModule.IWithdrawalObject>(
	'Withdrawal',
	withdrawalSchema
)
