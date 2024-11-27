import { Document } from 'mongoose'
import { IAmount } from './IAmount'

export declare module IJobApplicationModule {
	interface IInformation {
		cvUrl?: any
		firstName: string
		lastName: string
		city: string
		state: string
		zipCode: string
		apartment: string
		streetAddress: string
		phone: string
		email: string
		dateAvailable: Date | string
		socialSecurityNumber: string
		driversLicenseNumber: string
		positionAppliedFor: string
		isUSCitizen: boolean
		isAuthorizedToWork?: boolean
		haveWorkedForCompany: boolean
		lastWorkedDate?: Date | string
		doDrugs: boolean
		willPassDrugAndBackgroundCheck: boolean
		hasConviction: boolean
		convictionExplanation?: string
		dob: Date | string
		targetedLocation: string
		whyYou: string
	}
	interface IInstitute {
		name: string
		address: string
		from: Date | string
		to: Date | string
		didGraduate: Boolean
	}
	interface IEducation {
		highSchool: IInstitute
		college: IInstitute
		degree: string
	}
	interface IReference {
		fullName: string
		relationship: string
		company: string
		phone: string
		address: string
	}
	interface IEmployment {
		company: string
		phone: string
		address: string
		supervisor: string
		jobTitle: string
		startingSalary: IAmount
		endingSalary: IAmount
		responsibilities: string
		from: Date | string
		to: Date | string
		reasonForLeaving: string
		contactPreviousSupervisor: Boolean
	}
	interface IMilitaryService {
		branch: string
		from: Date | string
		to: Date | string
		rankAtDischarge: string
		typeOfDischarge: string
		explanationForDischarge: string
	}
	interface IEmergencyContact {
		name: string
		phone: string
		relationship: string
		address: string
	}
	interface ICreateJobApplication {
		information: IInformation
		education: IEducation
		references: IReference[]
		employmentHistory: IEmployment[]
		militaryService: IMilitaryService
		emergencyContact: IEmergencyContact
	}
	interface IJobApplicationObject extends Document {
		information: IInformation
		education: IEducation
		references: IReference[]
		employmentHistory: IEmployment[]
		militaryService: IMilitaryService
		emergencyContact: IEmergencyContact
		status: string
	}
}
