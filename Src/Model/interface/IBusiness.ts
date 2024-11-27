import { Document, ObjectId } from 'mongoose'
import { IAmount } from './IAmount'

export declare namespace IBusinessModels {
	interface IBusiness extends Document {
		title: string
		description: string
		website: string
		icon: string
		offersGas: boolean
		gasPrice: IAmount
		address: string
		owner: ObjectId
	}

	interface Create {
		title: string
		description: string
		website: string
		icon: string
		offersGas: boolean
		gasPrice: IAmount
		address: string
		owner: ObjectId
	}
}
