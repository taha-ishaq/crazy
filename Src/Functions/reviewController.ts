import { Request, Response } from 'express'
import reviewRepository from '../Repositories/reviewRepository.js'
import { returnError } from '../utils/resUtils.js'

const reviewController = {
	create: async (req: Request, res: Response) => {
		try {
			const { name, description, rating, productId, orderId } = req.body
			const userId = req.user._id
			const review = await reviewRepository.create({
				name,
				description,
				userId,
				rating,
				productId,
				orderId,
			})
			res.json({ success: true, review })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getAllReviews: async (req: Request, res: Response) => {
		try {
			const reviews = await reviewRepository.getReviews()
			res.status(200).json({ success: true, reviews })
		} catch (error) {
			returnError(req, res, error)
		}
	},
}
export default reviewController
