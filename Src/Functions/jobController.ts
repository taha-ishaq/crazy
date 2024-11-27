import { Request, Response } from 'express'
import vacancyRapository from '../Repositories/jobRapository.js'
import { returnError } from '../utils/resUtils.js'
const vacancyController = {
	create: async (req: Request, res: Response) => {
		const { title, address } = req.body
		const adminId = req.admin?._id
		const job = await vacancyRapository.cerateVacancy({
			adminId,
			title,
			address,
		})
		res.status(200).json({
			success: true,
			vacancy: job,
			message: 'Job has been added successfully',
		})
	},
	getAll: async (req: Request, res: Response) => {
		try {
			const { page, status } = req.query
			const jobs = await vacancyRapository.getVacancies(
				page as any,
				status as 'active' | 'inactive' | 'deleted'
			)
			res.status(200).json({ success: true, vacancies: jobs })
		} catch (error) {
			returnError(req, res, error)
		}
	},

	updateJob: async (req: Request, res: Response) => {
		try {
			const { id } = req.query
			const adminId = req.admin?._id
			const { title, address } = req.body
			const updatedJob = await vacancyRapository.updateVacancy({
				adminId,
				title,
				address,
				id: id as string,
			})
			res.status(200).json({
				success: true,
				updatedJob,
				message: 'Job has been updated successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getAllJobsForVisitor: async (req: Request, res: Response) => {
		try {
			const { page } = req.query
			const jobs = await vacancyRapository.getAllJobsForVisitor(page as any)
			res.status(200).json({ success: true, jobs })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	deleteJob: async (req: Request, res: Response) => {
		try {
			const { id, status } = req.query
			const adminId = req.admin?._id
			const updated = await vacancyRapository.deleteVacancy(
				adminId,
				id as string,
				status as 'active' | 'inactive' | 'deleted'
			)
			res.status(200).json({
				success: true,
				updated,
				message: `Job availability status has been updated to ${status}`,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getOne: async (req: Request, res: Response) => {
		try {
			const { id } = req.params
			const job = await vacancyRapository.getOne(id as string)
			res.status(200).json({ success: true, job })
		} catch (error) {
			returnError(req, res, Error)
		}
	},
}
export default vacancyController
