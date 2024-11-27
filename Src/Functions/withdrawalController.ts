import { Request, Response } from 'express'

import WithdrawalRepository from '../Repositories/withdrawalRepository.js'
import { returnError } from '../utils/resUtils.js'
const withdrawalController = {
	createWithdrawal: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const { balance } = req.body
			const Withdrawal = await WithdrawalRepository.createWithdrawal(
				userId,
				balance
			)
			return res.status(200).json({
				success: true,
				Withdrawal,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getAdminWithdrawals: async (req: Request, res: Response) => {
		try {
			const Withdrawals = await WithdrawalRepository.getAdminWithdrawals()
			return res.status(200).json({
				success: true,
				Withdrawals,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getWithdrawals: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id

			const { limit } = req.query

			const { withdrawals, pendingAmount } =
				await WithdrawalRepository.getWithdrawals({
					userId,
					limit: Number(limit) || 10,
				})
			return res.status(200).json({
				success: true,
				withdrawals,
				pendingAmount,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getAdminApprovedWithdrawals: async (req: Request, res: Response) => {
		try {
			// const userId = req.user?._id
			const withdrawals =
				await WithdrawalRepository.getAdminApprovedWithdrawals()
			return res.status(200).json({
				success: true,
				withdrawals,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	adminApproveWithdrawal: async (req: Request, res: Response) => {
		try {
			// const userId = req.user?._id
			const { withdrawalId } = req.query
			const approvedWithdrawal =
				await WithdrawalRepository.adminApproveWithdrawal(withdrawalId as any)
			return res.status(200).json({
				success: true,
				approvedWithdrawal,
				message: 'Withdrawal has been approved successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default withdrawalController
