import { ChangeStreamDocument } from 'mongodb'
import { IJobApplicationModule } from '../Model/interface/IJobApplication.js'
import careersRepository from '../Repositories/careersRepository.js'
import formatDate from '../utils/formatDate.js'

const formatDateFields = (obj: any, fields: string[]) => {
	fields.forEach((field: string) => {
		const date = obj[field] as Date
		if (date) {
			obj[field] = formatDate(date)
		}
	})
}

const JobApplicationListener = async (
	data: ChangeStreamDocument<IJobApplicationModule.IJobApplicationObject>
) => {
	try {
		if (data.operationType === 'insert') {
			const createdApplication = data.fullDocument

			//handling date fields
			formatDateFields(createdApplication.information, [
				'dateAvailable',
				'dob',
				'lastWorkedDate',
			])
			if (createdApplication.education.college) {
				formatDateFields(createdApplication.education.college, ['to', 'from'])
			}
			formatDateFields(createdApplication.education.highSchool, ['to', 'from'])
			if (createdApplication.militaryService) {
				formatDateFields(createdApplication.militaryService, ['to', 'from'])
			}

			// //info
			// createdApplication.information.dateAvailable = formatDate(
			// 	createdApplication.information.dateAvailable as Date
			// )

			// createdApplication.information.dob = formatDate(
			// 	createdApplication.information.dob as Date
			// )
			// createdApplication.information.lastWorkedDate = formatDate(
			// 	createdApplication.information.lastWorkedDate as Date
			// )

			// //education
			// createdApplication.education.college.to = formatDate(
			// 	createdApplication.education.college.to as Date
			// )
			// createdApplication.education.college.from = formatDate(
			// 	createdApplication.education.college.from as Date
			// )

			// createdApplication.education.highSchool.to = formatDate(
			// 	createdApplication.education.highSchool.to as Date
			// )
			// createdApplication.education.highSchool.from = formatDate(
			// 	createdApplication.education.highSchool.from as Date
			// )

			//sending mail to admin
			await Promise.all([
				careersRepository.sendEmailToAdmin(createdApplication),
				careersRepository.sendEmailToApplicant(createdApplication),
			])
		}
		if (data.operationType === 'update') {
			console.log('application updated')
		}
	} catch (e) {
		console.error(e)
	}
}

export default JobApplicationListener
