import { Document, ObjectId } from 'mongoose'
export declare namespace IUserModule {
	interface IPersonalInformation {
		fullName: string
		phoneNumber: string
		dob: Date
		profilePic: string
		personalAddress: IAddress
		gender: 'male' | 'female' | 'other'
		idCard: IidCardInfo
	}

	interface ICredentials {
		email: string
		password: string
		googleId: string
	}

	interface ILocation {
		type: 'Point'
		coordinates: [number, number]
	}
	interface IVerifyCredentialDetails {
		OTP: number
		OTPExpires: number
		emailVerifyStatus: boolean
		mobileVerifyStatus: boolean
	}
	interface IPaymentMethod {
		name: string
		cardNumber: string
		expiryDate: Date
		ccvCode: number
	}
	interface IidCardInfo {
		front: string
		back: string
		status: 'pending' | 'approved' | 'rejected'
		description: string
	}

	interface IBuyerAccount {
		deliverAddress: IAddress[]
	}
	interface IUpdateProfile {
		fullName?: string
		phoneNumber?: string
		email?: string
		DOB?: Date
		profilePic?: string
		gender?: string
		userId: ObjectId
		personalAddress?: IAddress
	}
	interface IWallet {
		balance: {
			amount: number
			currency: string
		}
		square: { squareId: string; cnonId: string }
		bankInformation: IBankInformation
	}
	interface IBankInformation {
		accountHolderName: string
		bankName: string
		iban: string
	}
	interface IUserObject extends Document {
		_id: ObjectId
		personalInformation: IPersonalInformation
		credentialDetails: ICredentials
		location: ILocation
		verifyCredentials: IVerifyCredentialDetails
		accountActive: boolean
		buyerAccount: IBuyerAccount
		selectedCurrency: string
		role: string
		wallet: IWallet
		searchHistory: string[]
	}
}
