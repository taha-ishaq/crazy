import { Request, Response } from 'express'
import careersRepository from '../Repositories/careersRepository.js'
import { returnError } from '../utils/resUtils.js'

const CareersController = {
	sendJobApplication: async (req: Request, res: Response) => {
		try {
			const data = JSON.parse(req.body.data)
			// const { data } = req.body
			const {
				information,
				education,
				references,
				employmentHistory,
				militaryService,
				emergencyContact,
			} = data

			const cv = req.files
				? req.files['cv']
					? req.files['cv'][0]
					: null
				: null

			const jobApplication = await careersRepository.sendJobApplication(
				{
					information,
					education,
					references,
					employmentHistory,
					militaryService,
					emergencyContact,
				},
				cv
			)

			res.json({
				success: true,
				jobApplication,
				message: 'Your job has been sent successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default CareersController
