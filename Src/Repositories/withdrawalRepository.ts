import mongoose, { ObjectId } from 'mongoose'
import { IAmount } from '../Model/interface/IAmount.js'
import { ITransactionModule } from '../Model/interface/ITransaction.js'
import Transaction from '../Model/transactionModel.js'
import User from '../Model/User.Model.js'
import Withdrawal from '../Model/withdrawalModel.js'

class WithdrawalRepository {
	public async createWithdrawal(userId: ObjectId | string, balance: IAmount) {
		if (!balance) {
			throw new Error('Please add balance to withdraw')
		}
		const user = await User.findById(userId).lean()
		if (!user) {
			throw new Error('Invalid user')
		}

		const userBalanceInDollars = user.wallet.balance.amount / 100

		if (userBalanceInDollars < balance.amount) {
			throw new Error('Insufficient funds')
		}

		const withdrawal = await Withdrawal.create({
			userId: new mongoose.Types.ObjectId(userId.toString()),
			balance,
			status: 'pending',
			description: 'Withdrawal request',
		})

		const amountToSubtract = balance.amount * 100

		await User.findByIdAndUpdate(userId, {
			$inc: {
				'wallet.balance.amount': -amountToSubtract,
			},
		})

		//creating transaction for outgoing
		const createTransaction: ITransactionModule.CreateTransaction = {
			userId,
			type: 'outgoing',
			title: 'withdrawal created',
			price: { amount: balance.amount, currency: balance.currency },
			description: 'requested for withdrawal',
			withdrawalId: withdrawal._id.toString(),
		}
		await Transaction.create(createTransaction)

		return withdrawal
	}

	public async getAdminWithdrawals() {
		const withdrawals = await Withdrawal.find({ status: 'pending' })
			.limit(50)
			.lean()

		return withdrawals
	}

	public async getWithdrawals(data: {
		userId: ObjectId | string
		limit: number
	}) {
		const [withdrawals, pendingWithdrawals] = await Promise.all([
			Withdrawal.find({ userId: data.userId })
				.sort({ createdAt: -1 })
				.limit(data.limit)
				.lean(),
			Withdrawal.find({ userId: data.userId, status: 'pending' }).lean(),
		])

		const pendingAmount = pendingWithdrawals.reduce(
			(total, withdrawal) => total + withdrawal.balance.amount,
			0
		)

		return {
			withdrawals,
			pendingAmount: {
				amount: pendingAmount,
				currency: 'USD',
			},
		}
	}

	public async adminApproveWithdrawal(withdrawalId: ObjectId | string) {
		const approvedWithdrawal = await Withdrawal.findOneAndUpdate(
			{ _id: withdrawalId },
			{ $set: { status: 'approved' } },
			{ new: true }
		)

		if (!approvedWithdrawal) {
			throw new Error('withdrawal not found')
		}

		return approvedWithdrawal
	}

	public async getAdminApprovedWithdrawals() {
		const withdrawals = await Withdrawal.find({ status: 'approved' })
			.limit(50)
			.sort({ CreatedAt: -1 })
			.lean()

		return withdrawals
	}
}

export default new WithdrawalRepository()
