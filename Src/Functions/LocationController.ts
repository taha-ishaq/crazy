import { Request, Response } from 'express'
import LocationRepository from '../Repositories/LocationRepository.js'
import { returnError } from '../utils/resUtils.js'

const LocationController = {
	locations: async (req: Request, res: Response) => {
		try {
			const locations = await LocationRepository.getLocations()

			return res.status(200).json({
				status: 'success',
				data: locations,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default LocationController
