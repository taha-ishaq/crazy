import bcrypt from 'bcryptjs'
import mongoose, { Schema } from 'mongoose'
import { IAdminModule } from './interface/IAdmin.js'

const adminSchema: Schema<IAdminModule.IAdminObject> =
	new mongoose.Schema<IAdminModule.IAdminObject>({
		fullName: {
			type: String,
		},
		email: {
			type: String,
			lowercase: true,
		},
		storeName: {
			type: String,
		},
		password: {
			type: String,
		},
		profilePic: {
			type: String,
		},
		address: {
			formattedAddress: { type: String },
			latitude: { type: Number },
			longitude: { type: Number },
			country: { type: String },
			isoCode: { type: String },
			state: { type: String },
			city: { type: String },
			type: { type: String, enum: ['Point'], required: false },
			coordinates: {
				type: [Number],
				index: '2dsphere',
			},
		},
	})

// mongoose middleware which will run before saving the document into the database

adminSchema.pre('save', async function (next) {
	// Password will get hashed when the password field gets update
	if (!this.isModified('password')) return next()

	// if (this.credentialDetails.password === '') {
	// 	return next()
	// }
	// Hash the password
	this.password = await bcrypt.hash(this.password, 12)

	next()
})
const Admin = mongoose.model('Admin', adminSchema)

export default Admin
