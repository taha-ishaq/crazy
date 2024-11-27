import { Request, Response } from 'express'
import GeocodeService from '../services/geoCodeServices.js'
import { returnError } from '../utils/resUtils.js'

const GeocodeController = {
	direction: async (req: Request, res: Response) => {
		try {
			const { fromLat, fromLng, toLat, toLng } = req.query

			const from = {
				latitude: Number(fromLat),
				longitude: Number(fromLng),
			}

			const to = {
				latitude: Number(toLat),
				longitude: Number(toLng),
			}

			const response = await GeocodeService.direction(from, to)

			return res.status(200).json({ success: true, response })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	addressFromCoords: async (req: Request, res: Response) => {
		try {
			const { latitude, longitude } = req.query

			const response = await GeocodeService.addressFromCoords(
				Number(latitude),
				Number(longitude)
			)

			return res.status(200).json({ success: true, response })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	autoCompleteAddress: async (req: Request, res: Response) => {
		try {
			const { input, latitude, longitude, radius } = req.query

			const response = await GeocodeService.autoComplete(
				String(input),
				Number(latitude),
				Number(longitude),
				Number(radius)
			)

			return res.status(200).json({
				success: true,
				response,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	AutoCompleteAddressDetails: async (req: Request, res: Response) => {
		try {
			const { placeId } = req.query

			const response = await GeocodeService.autocompleteDetails(
				placeId as string
			)

			return res.status(200).json({
				success: true,
				response,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default GeocodeController
