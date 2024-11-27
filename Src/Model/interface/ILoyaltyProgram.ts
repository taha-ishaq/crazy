import { Document } from 'mongoose'
import { IAmount } from './IAmount'

export declare namespace ILoyaltyProgram {
	interface Model extends Document {
		personalInfo: {
			firstName: string
			lastName: string
			phoneNumber: string
			dateOfBirth: Date
			address: {
				streetAddress: string
				city: string
				state: string
				zipCode: string
			}
		}

		email: string

		duration: 'oneYear' | 'twoYear' | 'threeYear'
		paymentLink: string

		payment: {
			paid: boolean
			price: IAmount
			date: Date
			link: string
		}

		preferences: {
			consentToReceiveEmailAndSMS: boolean
		}
	}

	interface Create {
		personalInfo: Model['personalInfo']
		email: string
		duration: Model['duration']
		payment?: Model['payment']
		preferences: Model['preferences']
	}
}
