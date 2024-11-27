import { ObjectId } from 'mongoose'

export declare module IContactUsModel {
	interface IContactUs extends Document {
		_id: ObjectId
		name: string
		email: string
		phone: string
		description: string
	}
	interface IContactCreate {
		name: string
		email: string
		phone: string
		description: string
	}
}
