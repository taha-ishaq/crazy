import { Document, ObjectId } from 'mongoose'
import { IAmount } from './IAmount.js'

export declare module IWithdrawalModule {
	interface IWithdrawalObject extends Document {
		_id: ObjectId
		userId: ObjectId
		balance: IAmount
		status: 'pending' | 'approved'
		description: { type: String }
	}
}
