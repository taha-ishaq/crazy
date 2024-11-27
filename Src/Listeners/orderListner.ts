import { ChangeStreamDocument } from 'mongodb'

import { IOrderModule } from '../Model/interface/IOrder.js'
import buyerRepository from '../Repositories/buyerRepository.js'

const OrderListener = async (
	data: ChangeStreamDocument<IOrderModule.IOrderObject>
) => {
	try {
		if (data.operationType === 'insert') {
			const createdOrder = data.fullDocument

			await buyerRepository.updateUserWalletBalance(
				createdOrder.userId,
				createdOrder.totals.grandTotal.amount,
				createdOrder._id
			)
		}
		if (data.operationType === 'update') {
		}
	} catch (e) {
		console.error(e)
	}
}

export default OrderListener
