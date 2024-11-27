import { Request, Response } from 'express'
import NewsRepository from '../Repositories/NewsRepository.js'
import { returnError } from '../utils/resUtils.js'

const newsController = {
	getNews: async (req: Request, res: Response) => {
		try {
			const news = await NewsRepository.getNews()
			res.status(200).json({ success: true, news })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	create: async (req: Request, res: Response) => {
		const { business, title, description, image } = req.body
		const news = await NewsRepository.createNews({
			business,
			title,
			description,
			image,
		})
		res.status(201).json({ success: true, news })
	},
}
export default newsController
