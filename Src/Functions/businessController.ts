import { Request, Response } from 'express'
import { IBusinessModels } from '../Model/interface/IBusiness.js'
import businessRepository from '../Repositories/businessRepository.js'
import { returnError } from '../utils/resUtils.js'

const businessController = {
	create: async (req: Request, res: Response) => {
		try {
			const { title, description, icon, website, offersGas, address } = req.body

			const createObj: IBusinessModels.Create = {
				title,
				description,
				icon,
				website,
				owner: req.user._id,
				offersGas,
				gasPrice: {
					amount: 0,
					currency: 'USD',
				},
				address,
			}
			const business = await businessRepository.create(createObj)
			res.json({ success: true, business })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getBusinesses: async (req: Request, res: Response) => {
		try {
			const businesses = await businessRepository.getBusinesses()
			res.status(201).json({ success: true, businesses })
		} catch (error) {
			returnError(req, res, error)
		}
	},
}
export default businessController
