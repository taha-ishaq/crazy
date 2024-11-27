import { ILoyaltyProgram } from '../Model/interface/ILoyaltyProgram.js'
import LoyaltyProgramUserModel from '../Model/LoyaltyProgramUser.Model.js'
import SquareService from '../services/square.Service.js'

class LoyaltyProgramRepo {
	public async signUp(data: ILoyaltyProgram.Create) {
		if (!data.personalInfo.phoneNumber) {
			throw new Error('Phone number is required')
		}

		const alreadyExists = await LoyaltyProgramUserModel.findOne({
			phoneNumber: data.personalInfo.phoneNumber,
		})

		if (alreadyExists) {
			throw new Error('Phone number is already registered')
		}

		const price = this.subscriptionPrice(data.duration)

		const link = await SquareService.generateLinkForLoyaltyProgram(data)

		data.payment = {
			paid: true,
			price,
			date: new Date(),
			link: link?.url || '',
		}

		const create = await LoyaltyProgramUserModel.create(data)

		return create
	}

	private subscriptionPrice(duration: ILoyaltyProgram.Model['duration']) {
		if (duration === 'oneYear') {
			return {
				amount: 19.99,
				currency: 'USD',
			}
		}

		if (duration === 'twoYear') {
			return {
				amount: 24.99,
				currency: 'USD',
			}
		}

		if (duration === 'threeYear') {
			return {
				amount: 29.99,
				currency: 'USD',
			}
		}

		throw new Error('Invalid duration')
	}
}

export default new LoyaltyProgramRepo()
