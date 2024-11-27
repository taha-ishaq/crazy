import mongoose, { Schema } from 'mongoose'
import { IJobApplicationModule } from './interface/IJobApplication'

const JobApplicationSchema: Schema<IJobApplicationModule.IJobApplicationObject> =
	new mongoose.Schema<IJobApplicationModule.IJobApplicationObject>(
		{
			information: {
				cvUrl: { type: String, required: false },
				firstName: { type: String },
				lastName: { type: String },
				city: { type: String },
				state: { type: String },
				zipCode: { type: String },
				apartment: { type: String },
				streetAddress: { type: String },
				phone: { type: String },
				email: { type: String, lowercase: true },
				dateAvailable: { type: Date },
				socialSecurityNumber: { type: String },
				driversLicenseNumber: { type: String },
				positionAppliedFor: { type: String },
				isUSCitizen: { type: Boolean, required: true },
				isAuthorizedToWork: { type: Boolean, required: false },
				haveWorkedForCompany: { type: Boolean },
				lastWorkedDate: { type: Date, required: false },
				doDrugs: { type: Boolean },
				willPassDrugAndBackgroundCheck: { type: Boolean },
				hasConviction: { type: Boolean },
				convictionExplanation: { type: String, required: false },
				dob: {
					type: Date,
					required: true,
				},
				targetedLocation: {
					type: String,
					required: true,
				},
				whyYou: {
					type: String,
					required: true,
				},
			},
			education: {
				highSchool: {
					name: { type: String },
					address: { type: String },
					from: { type: Date },
					to: { type: Date },
					didGraduate: { type: Boolean },
				},
				college: {
					name: { type: String },
					address: { type: String },
					from: { type: Date },
					to: { type: Date },
					didGraduate: { type: Boolean },
				},
				degree: { type: String },
			},
			references: [
				{
					fullName: { type: String },
					relationship: { type: String },
					company: { type: String },
					phone: { type: String },
					address: { type: String },
				},
			],
			employmentHistory: [
				{
					company: { type: String },
					phone: { type: String },
					address: { type: String },
					supervisor: { type: String },
					jobTitle: { type: String },
					startingSalary: {
						amount: { type: Number },
						currency: { type: String },
					},
					endingSalary: {
						amount: { type: Number },
						currency: { type: String },
					},
					responsibilities: { type: String },
					from: { type: Date },
					to: { type: Date },
					reasonForLeaving: { type: String },
					contactPreviousSupervisor: { type: Boolean },
				},
			],
			militaryService: {
				branch: { type: String },
				from: { type: Date },
				to: { type: Date },
				rankAtDischarge: { type: String },
				typeOfDischarge: { type: String },
				explanationForDischarge: { type: String },
			},

			emergencyContact: {
				name: { type: String },
				phone: { type: String },
				relationship: { type: String },
				address: { type: String },
			},
			status: {
				type: String,
				enum: ['approved', 'rejected', 'pending'],
				default: 'pending',
			},
		},
		{ timestamps: true }
	)

export default mongoose.model<IJobApplicationModule.IJobApplicationObject>(
	'JobApplication',
	JobApplicationSchema
)
