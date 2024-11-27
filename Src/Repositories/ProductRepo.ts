import { ObjectId, PipelineStage } from 'mongoose'
import Product from '../Model/Product.Model.js'

class ProductRepository {
	public async getAllProducts(currentUserId?: ObjectId) {
		const pipeline: PipelineStage[] = [
			{
				$match: {
					availabilityStatus: 'active',
				},
			},
			{
				$limit: 30,
			},
			...this.getProject(currentUserId),
		]

		const products = await Product.aggregate(pipeline)

		return products
	}

	public async productsByCategory(data: {
		category: string
		page: number
		limit: number
		currentUserId?: ObjectId
	}) {
		const pipeline: PipelineStage[] = [
			{
				$match: {
					category: {
						$in: [data.category],
					},
					availabilityStatus: 'active',
				},
			},
			{
				$skip: (data.page - 1) * data.limit,
			},
			{
				$limit: data.limit,
			},
			...this.getProject(data.currentUserId),
		]

		const products = await Product.aggregate(pipeline)

		return products
	}

	public async bestSellerProducts(currentUserId?: ObjectId) {
		const pipeline: PipelineStage[] = [
			{
				$sort: {
					rating: -1, // Sort by numberOfRatings in descending order
				},
			},
			{
				$limit: 10,
			},

			...this.getProject(currentUserId),
		]

		const data = await Product.aggregate(pipeline)
		return data
	}

	private getProject(userId?: ObjectId) {
		const pipeline: PipelineStage[] = [
			{
				$addFields: {
					priceBeforeDiscount: '$productPrice',
					percentageAfterDiscount: {
						$subtract: [100, '$discount'],
					},
				},
			},
			{
				$addFields: {
					productPrice: {
						currency: '$productPrice.currency',
						amount: {
							$multiply: [
								'$productPrice.amount',
								{
									$divide: ['$percentageAfterDiscount', 100],
								},
							],
						},
					},
					priceBeforeDiscount: '$productPrice',

					rating: {
						$cond: {
							if: { $eq: ['$rating.numRating', 0] },
							then: 0,
							else: { $divide: ['$rating.totalRating', '$rating.numRating'] },
						},
					},
				},
			},
		]

		if (userId) {
			pipeline.push({
				$addFields: {
					isFavorite: {
						$in: [userId, '$favoriteOf'],
					},
				},
			})
		} else {
			pipeline.push({
				$addFields: {
					isFavorite: false,
				},
			})
		}

		const project = {
			_id: 1,
			productName: 1,
			productPrice: 1,
			productImage: 1,
			priceBeforeDiscount: 1,
			category: 1,
			subCategory: 1,
			isFavorite: 1,
			rating: {
				$round: ['$rating', 1],
			},
			discount: 1,
		}

		pipeline.push({
			$project: project,
		})

		return pipeline
	}
}

export default new ProductRepository()
