import BusinessModel from '../Model/Business.Model.js'
import { IBusinessModels } from '../Model/interface/IBusiness.js'

class businessRepository {
	public async create(data: IBusinessModels.Create) {
		if (!data) throw new Error('invalid data input')
		const business = await BusinessModel.create(data)
		return business
	}
	public async getBusinesses() {
		const businesses = await BusinessModel.find().lean()
		if (businesses.length <= 0) throw new Error('No business found')
		return businesses
	}
}
export default new businessRepository()
