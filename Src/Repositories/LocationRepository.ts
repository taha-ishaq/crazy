import BusinessModel from '../Model/Business.Model.js'

class LocationRepository {
	public async getLocations() {
		const businesses = await BusinessModel.find().lean()

		return businesses
	}
}

export default new LocationRepository()
