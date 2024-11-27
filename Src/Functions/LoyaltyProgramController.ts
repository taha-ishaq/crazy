import { Request, Response } from 'express'
import LoyaltyProgramRepo from '../Repositories/LoyaltyProgramRepo.js'
import { returnError } from '../utils/resUtils.js'

const LoyaltyProgramController = {
	signUp: async (req: Request, res: Response) => {
		try {
			const {
				firstName,
				lastName,
				phoneNumber,
				email,
				streetAddress,
				city,
				state,
				zipCode,
				consentToReceiveEmailAndSMS,
				duration,

				dateOfBirth,
			} = req.body
			const user = await LoyaltyProgramRepo.signUp({
				email,
				duration,

				personalInfo: {
					firstName,
					lastName,
					phoneNumber,
					dateOfBirth,
					address: {
						zipCode,
						state,
						city,
						streetAddress,
					},
				},

				preferences: {
					consentToReceiveEmailAndSMS,
				},
			})
			res.json({ success: true, user })
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default LoyaltyProgramController
