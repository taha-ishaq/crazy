import moment from 'moment'
import { ObjectId } from 'mongoose'
import { IVacancyModule } from '../Model/interface/IJob.js'
import Job from '../Model/jobModel.js'
import IntlUtil from '../utils/IntlUtils.js'

class vacancyRepository {
	public async cerateVacancy(data: IVacancyModule.IVacancy) {
		if (!data.adminId) throw new Error('Invalid Admin!!')

		const vacancy = await Job.create(data)
		return vacancy
	}
	public async getVacancies(
		page: number = 1,
		status: 'active' | 'inactive' | 'deleted'
	) {
		const pageSize = 10
		const skipCount = (page - 1) * pageSize

		const vacancies = await Job.find({ status })
			.limit(pageSize)
			.skip(skipCount)
			.lean()

		vacancies.forEach((vacancy) => {
			const { createdAt } = vacancy
			if (createdAt) {
				const currentDate = moment()
				const createdAtDate = moment(createdAt)
				const daysDifference = currentDate.diff(createdAtDate, 'days')

				vacancy['daysAgo'] = IntlUtil.getTimeElapsed(daysDifference)
			}
		})

		return vacancies
	}
	public async getAllJobsForVisitor(page: number = 1) {
		const pageSize = 10
		const skipCount = (page - 1) * pageSize

		const vacancies = await Job.find({ status: 'active' })
			.limit(pageSize)
			.skip(skipCount)
			.lean()

		vacancies.forEach((vacancy) => {
			const { createdAt } = vacancy
			if (createdAt) {
				const currentDate = moment()
				const createdAtDate = moment(createdAt)
				const daysDifference = currentDate.diff(createdAtDate, 'days')

				vacancy['daysAgo'] = IntlUtil.getTimeElapsed(daysDifference)
			}
		})

		return vacancies
	}
	public async updateVacancy(data: IVacancyModule.IVacancyUpdate) {
		if (!data.adminId) throw new Error('Invalid Admin!!')

		const vacancies = await Job.findByIdAndUpdate(
			data.id,
			{ title: data.title, address: data.address },
			{ new: true }
		).lean()
		return vacancies
	}
	public async deleteVacancy(
		adminId: ObjectId,
		id: ObjectId | string,
		status: 'active' | 'inactive' | 'deleted'
	) {
		if (!adminId) throw new Error('Invalid Admin!!')
		const updated = await Job.findByIdAndUpdate(
			id,
			{ adminId, status },
			{ new: true }
		)
		return updated
	}
	public async getOne(id: string) {
		const job = await Job.findById(id).lean()
		if (!job) throw new Error('job not found')

		const { createdAt } = job
		const currentDate = moment()
		const createdAtDate = moment(createdAt)
		const daysDifference = currentDate.diff(createdAtDate, 'days')
		job['daysAgo'] = IntlUtil.getTimeElapsed(daysDifference)
		return job
	}
}

export default new vacancyRepository()
