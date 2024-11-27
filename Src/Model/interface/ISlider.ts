import { Document } from 'mongoose'

export declare module ISliderModule {
	interface ISliderObject extends Document {
		url: string
		image: string
	}
}
