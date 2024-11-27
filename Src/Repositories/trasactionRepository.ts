import { ObjectId } from 'mongoose'
import { IAmount } from '../Model/interface/IAmount.js'
import Transaction from '../Model/transactionModel.js'
import User from '../Model/User.Model.js'

class TransactionRepository {
	public async transactions(userId: ObjectId | string, limit: number = 30) {
		return await Transaction.find({ userId })
			.sort({ createdAt: -1 })
			.limit(limit)
			.lean()
	}

	public async balance(userId: ObjectId | string) {
		const user = await User.findById(userId).lean()

		if (!user) {
			throw new Error('User not found')
		}

		if (!user.wallet) {
			await User.findByIdAndUpdate(
				userId,
				{
					$set: {
						wallet: {
							balance: {
								amount: 0,
								currency: 'USD',
							},
						},
					},
				},
				{ new: true }
			)

			return {
				amount: 0,
				currency: 'USD',
			}
		}
		const { balance } = user?.wallet
		const amount: IAmount = {
			amount: balance?.amount ? balance.amount / 100 : 0,
			currency: balance?.currency || 'USD',
		}
		return amount
	}

	public async wallet(userId: ObjectId | string) {
		const [balance, transactions] = await Promise.all([
			this.balance(userId),
			this.transactions(userId),
		])

		return { balance, transactions }
	}
}
export default new TransactionRepository()
