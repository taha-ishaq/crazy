import mongoose, { Schema } from 'mongoose'
import { ICategoryModule } from './interface/ICategory.js'

const categorySchema: Schema<ICategoryModule.ICategoryObject> =
	new mongoose.Schema<ICategoryModule.ICategoryObject>(
		{
			name: {
				type: String,
			},
			icon: {
				type: String,
			},
            
            subCategories:{
                type:[String]
            }
		},
		{
			timestamps: true,
		}
	)

const Category = mongoose.model('Category', categorySchema)

export default Category
