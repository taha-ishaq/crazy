import { Request, Response } from 'express'
import TransactionRepository from '../Repositories/trasactionRepository.js'
import { returnError } from '../utils/resUtils.js'

const transactionController = {
	transactions: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id

			const transactions = await TransactionRepository.transactions(
				userId,
				Number(req.query.limit) || 30
			)

			return res.status(200).json({
				success: true,
				transactions,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	balance: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id

			const balance = await TransactionRepository.balance(userId)

			return res.status(200).json({
				success: true,
				balance,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	wallet: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id

			const wallet = await TransactionRepository.wallet(userId)

			return res.status(200).json({
				success: true,
				wallet,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default transactionController
