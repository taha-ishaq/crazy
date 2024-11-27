import mongoose from 'mongoose'
import JobApplicationListener from '../Listeners/jobApplicationListner.js'
import loyaltyProgramListener from '../Listeners/LoyaltyProgramListener.js'
import OrderListener from '../Listeners/orderListner.js'
import { IJobApplicationModule } from '../Model/interface/IJobApplication.js'
import { ILoyaltyProgram } from '../Model/interface/ILoyaltyProgram.js'
import { IOrderModule } from '../Model/interface/IOrder.js'
import environments from './environments.js'

const DB = environments.mongoURL ?? ''

const DBConnect = async () => {
	try {
		const connection = await mongoose.connect(DB)
		console.log(`Database connected to ${connection.connection.host}`)
		connection.connection
			.model<IJobApplicationModule.IJobApplicationObject>('JobApplication')
			.watch([], { fullDocument: 'updateLookup' })
			.on('change', JobApplicationListener)
		connection.connection
			.model<IOrderModule.IOrderObject>('Order')
			.watch([], { fullDocument: 'updateLookup' })
			.on('change', OrderListener)
		connection.connection
			.model<ILoyaltyProgram.Model>('LoyaltyProgramUser')
			.watch([], { fullDocument: 'updateLookup' })
			.on('change', loyaltyProgramListener)
	} catch (error) {
		console.log({ at: 'connecting to DB error', error })
	}
}

export default DBConnect
