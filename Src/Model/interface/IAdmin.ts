import { Document, ObjectId } from 'mongoose'

export declare module IAdminModule {
	interface IAdminObject extends Document {
		_id: ObjectId
		fullName: string
		email: string
		storeName: string
		password: string
		profilePic: string
		address: IAddress
	}
}
