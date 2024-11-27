import mongoose, { Schema } from 'mongoose'
import { IVacancyModule } from './interface/IJob.js'

const vacancySchema: Schema<IVacancyModule.IVacancy> =
	new mongoose.Schema<IVacancyModule.IVacancy>(
		{
			adminId: {
				type: Schema.Types.ObjectId,
				ref: 'Admin',
				required: true,
			},
			title: {
				type: String,
				required: true,
			},
			status: {
				type: String,
				enum: ['active', 'inactive', 'deleted'],
				default: 'active'
			},
			address: {
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
		{ timestamps: true }
	)
export default mongoose.model('Job', vacancySchema)
