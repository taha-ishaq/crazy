import { Request, Response } from 'express'
import ProductRepo from '../Repositories/ProductRepo.js'
import { returnError } from '../utils/resUtils.js'

const ProductController = {
	getAllProducts: async (req: Request, res: Response) => {
		try {
			const products = await ProductRepo.getAllProducts(req.user?._id)

			res.json({ success: true, products })
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getProductsByCategory: async (req: Request, res: Response) => {
		try {
			const { category, page, limit } = req.query
			const products = await ProductRepo.productsByCategory({
				category: category as string,
				page: parseInt((page ?? 1) as string),
				limit: parseInt((limit ?? 10) as string),
				currentUserId: req.user?._id,
			})

			res.json({ success: true, products })
		} catch (error) {
			returnError(req, res, error)
		}
	},

	productSuggestion: async (req: Request, res: Response) => {
		try {
			const { category } = req.query

			const [bestSellerProducts, basedOnYourInterest] = await Promise.all([
				ProductRepo.bestSellerProducts(req.user?._id),
				ProductRepo.productsByCategory({
					category: category as string,
					page: 1,
					limit: 14,
				}),
			])

			const data = [
				{ title: 'Best by seller', products: bestSellerProducts },
				{ title: 'Based on your interest', products: basedOnYourInterest },
			]

			res.json({ success: true, data })
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default ProductController
