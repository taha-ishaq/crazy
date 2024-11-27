import { Request, Response } from 'express'
import LendingPageRepo from '../Repositories/LendingPageRepo.js'
import { returnError } from '../utils/resUtils.js'

const lendingPageController = {
	addConnection: async (req: Request, res: Response) => {
		try {
			const { name, email, phoneNumber, message } = req.body as {
				name: string
				email: string
				phoneNumber: string
				message: string
			}
			const connection = await LendingPageRepo.addConnections({
				name,
				email,
				phoneNumber,
				message,
			})
			res.status(200).json({
				success: true,
				message: 'Submitted successfully',
				guest: connection,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getAllConnections: async (req: Request, res: Response) => {
		try {
			const connections = await LendingPageRepo.getAllConnections()
			res.status(200).json({ success: true, connections })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	connectionById: async (req: Request, res: Response) => {
		try {
			const connection = await LendingPageRepo.connectionById(
				req.query.id as string
			)
			res.status(201).json({ success: true, connection })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getSliders: (req: Request, res: Response) => {
		try {
			const sliders = LendingPageRepo.getSliders()
			res.status(201).json({ success: true, sliders })
		} catch (error) {
			returnError(req, res, error)
		}
	},
}
export default lendingPageController
