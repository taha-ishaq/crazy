import { Document } from 'mongoose'

export declare module ICategoryModule {
	interface ICategoryObject extends Document {
		name: string
		icon: string
		ranking: number
		subCategories: string[]
	}
}
