import { ObjectId } from 'mongoose'

export declare module IVacancyModule {
	interface IVacancy {
		adminId: ObjectId
		title: string
		address: IAddress
		createdAt?: Date
		status?: string
	}
	interface IVacancyUpdate {
		adminId: ObjectId
		title: string
		address: IAddress
		id: ObjectId | string
	}
}
