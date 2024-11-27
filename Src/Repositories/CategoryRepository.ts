import Category from '../Model/categoryModel.js'
import Product from '../Model/Product.Model.js'

class CategoryRepository {
	public async topCategories() {
		const categories = await Category.find().select('-subCategories').lean()

		return await Promise.all(
			categories.map(async (category) => {
				const count = await Product.countDocuments({
					category: { $in: [category.name] },
				})
				return {
					count,
					category,
				}
			})
		)
	}
}

export default new CategoryRepository()
