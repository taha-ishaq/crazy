import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'
import { IUserModule } from './interface/IUser.js'

const userSchema: Schema<IUserModule.IUserObject> =
	new mongoose.Schema<IUserModule.IUserObject>({
		personalInformation: {
			fullName: {
				type: String,
			},
			phoneNumber: {
				type: String,
			},
			dob: {
				type: Date,
			},

			profilePic: {
				type: String,
				default: '',
			},
			gender: {
				type: String,
				toLowerCase: true,
				enum: ['male', 'female', 'other'],
			},
			idCard: {
				front: { type: String, default: '' },
				back: { type: String, default: '' },
				status: {
					type: String,
					enum: ['pending', 'approved', 'rejected', 'none'],
					default: 'none',
				},
				description: { type: String },
			},
			personalAddress: {
				type: {
					type: String,
					enum: ['Point'],
				},
				formattedAddress: {
					type: String,
				},
				latitude: {
					type: Number,
				},
				longitude: {
					type: Number,
				},
				isoCode: {
					type: String,
				},
				city: {
					type: String,
				},
				state: {
					type: String,
				},
				coordinates: {
					type: [Number],
					index: '2dsphere',
				},
				country: {
					type: String,
				},
			},
		},

		credentialDetails: {
			email: {
				type: String,
				lowercase: true,
			},
			password: {
				type: String,
				select: false,
			},
			googleId: {
				type: String,
			},
		},
		verifyCredentials: {
			OTP: {
				type: Number,
				select: false,
			},
			OTPExpires: {
				type: Number,
				select: false,
			},
			emailVerifyStatus: {
				type: Boolean,
			},
			mobileVerifyStatus: {
				type: Boolean,
			},
		},
		buyerAccount: {
			deliverAddress: [
				{
					type: {
						type: String,
						enum: ['Point'],
					},
					formattedAddress: {
						type: String,
					},
					latitude: {
						type: Number,
					},
					longitude: {
						type: Number,
					},
					isoCode: {
						type: String,
					},
					city: {
						type: String,
					},
					state: {
						type: String,
					},
					coordinates: {
						type: [Number],
						index: '2dsphere',
					},
					country: {
						type: String,
					},
				},
			],
		},
		//******* Search History ********/
		searchHistory: { type: [String], select: false },

		// ******* Wallet ***********

		wallet: {
			balance: {
				amount: {
					type: Number,
					default: 0,
				},
				currency: {
					type: String,
					default: 'USD',
				},
			},
			square: {
				squareId: { type: String },
				cnonId: { type: String },
			},
			bankInformation: {
				type: {
					accountHolderName: { type: String },
					bankName: { type: String },
					iban: { type: String },
				},
				select: false,
			},
		},

		accountActive: {
			type: Boolean,
			default: true,
		},
		selectedCurrency: {
			type: String,
		},
		role: {
			type: String,
			enum: ['admin', 'buyer'],
			default: 'buyer',
		},
	})

// mongoose middleware which will run before saving the document into the database

userSchema.pre('save', async function (next) {
	// Password will get hashed when the password field gets update
	if (!this.isModified('credentialDetails.password')) return next()

	// if (this.credentialDetails.password === '') {
	// 	return next()
	// }
	// Hash the password
	this.credentialDetails.password = await bcrypt.hash(
		this.credentialDetails.password,
		12
	)

	next()
})

const User = mongoose.model<IUserModule.IUserObject>('User', userSchema)
export default User
