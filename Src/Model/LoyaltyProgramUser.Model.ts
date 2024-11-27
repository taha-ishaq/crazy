import mongoose, { Schema } from 'mongoose'
import { ILoyaltyProgram } from './interface/ILoyaltyProgram.js'

const LoyaltyProgramUser: Schema<ILoyaltyProgram.Model> =
	new mongoose.Schema<ILoyaltyProgram.Model>(
		{
			personalInfo: {
				firstName: { type: String, required: true },
				lastName: { type: String, required: true },
				phoneNumber: { type: String, required: true, unique: true },
				dateOfBirth: { type: Date, required: true },
				address: {
					streetAddress: { type: String, required: true },
					city: { type: String, required: true },
					state: { type: String, required: true },
					zipCode: { type: String, required: true },
				},
			},
			preferences: {
				consentToReceiveEmailAndSMS: { type: Boolean, required: true },
			},
			email: { type: String, required: true, lowercase: true },
			paymentLink: { type: String },
			duration: {
				type: String,
				enum: ['oneYear', 'twoYear', 'threeYear'],
				required: true,
			},
			payment: {
				paid: { type: Boolean, default: false },
				price: {
					amount: { type: Number },
					currency: { type: String },
				},
				date: { type: Date },
				link: { type: String },
			},
		},
		{ timestamps: true }
	)

export default mongoose.model<ILoyaltyProgram.Model>(
	'LoyaltyProgramUser',
	LoyaltyProgramUser
)
