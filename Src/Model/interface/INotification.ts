import { Document, ObjectId } from 'mongoose'

export declare module INotificationModule {
	interface INotificationObject extends Document {
		userId: ObjectId
		title: string
		subtitle: string
		icon: string
		type: string
	}
}
