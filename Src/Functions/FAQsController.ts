import { Request, Response } from 'express'
import FAQsRepository from '../Repositories/FAQsRepository.js'
import { returnError } from '../utils/resUtils.js'

const FAQsController = {
	create: async (req: Request, res: Response) => {
		try {
			const { question, answer } = req.body
			// const admin = req.user._id
			const FAQ = await FAQsRepository.create({ question, answer })
			res.status(201).json({ success: true, FAQ })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	get: async (req: Request, res: Response) => {
		try {
			const faqId = req.params.id
			const FAQs = await FAQsRepository.getById(faqId)
			res.status(201).json({ success: true, FAQs })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getAll: async (req: Request, res: Response) => {
		try {
			const FAQs = await FAQsRepository.getAll()
			res.status(201).json({ success: true, FAQs })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	update: async (req: Request, res: Response) => {
		try {
			const faqId = req.params.id
			const { question, answer } = req.body
			const updatedFAQ = await FAQsRepository.update({
				faqId,
				question,
				answer,
			})
			res.status(201).json({ success: true, updatedFAQ })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	delete: async (req: Request, res: Response) => {
		try {
			const faqId = req.params.id
			const message = await FAQsRepository.delete(faqId)
			res.status(201).json({ success: true, message })
		} catch (error) {
			returnError(req, res, error)
		}
	},
}
export default FAQsController
