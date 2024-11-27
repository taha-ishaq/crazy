import { Document } from 'mongoose'

export declare module IDealModule {
	interface IDealObject extends Document {
		name?: string
		image: string
		// orderCount: number
		// offPercentage: number
	}
}
