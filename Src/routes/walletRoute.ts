import express from 'express'
import transactionController from '../Functions/transactionController.js'
import withdrawalController from '../Functions/withdrawalController.js'
import Authentication from '../Middleware/Authentication.js'

const walletRoutes = express.Router()

walletRoutes.get('/', Authentication.passport, transactionController.wallet)

walletRoutes.get(
	'/transactions',
	Authentication.passport,
	transactionController.transactions
)

walletRoutes.get(
	'/balance',
	Authentication.passport,
	transactionController.balance
)

walletRoutes.post(
	'/create-withdrawal',
	Authentication.passport,
	withdrawalController.createWithdrawal
)

walletRoutes.get(
	'/withdrawals',
	Authentication.passport,
	withdrawalController.getWithdrawals
)
// walletRoutes.patch(
// 	'/bankinfo',
// 	Authentication.passport,
// 	authController.bankInfo
// )

// walletRoutes.get(
// 	'/bankinfo',
// 	Authentication.passport,
// 	authController.getBankInfo
// )
export default walletRoutes
