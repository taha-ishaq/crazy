import mongoose, { Schema } from 'mongoose'
import { ITransactionModule } from './interface/ITransaction.js'

const transactionSchema: Schema<ITransactionModule.doc> =
	new mongoose.Schema<ITransactionModule.doc>(
		{
			userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
			type: {
				type: String,
				enum: ['incoming', 'outgoing'],
				required: true,
			},
			title: { type: String },
			price: {
				amount: {
					type: Number,
				},
				currency: {
					type: String,
				},
			},
			description: { type: String },
			orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: false },
			withdrawalId: {
				type: Schema.Types.ObjectId,
				ref: 'Withdrawal',
				required: false,
			},
		},
		{
			timestamps: true,
		}
	)

// mongoose middleware which will run before saving the document into the database

const Transaction = mongoose.model<ITransactionModule.doc>(
	'Transaction',
	transactionSchema
)

export default Transaction
