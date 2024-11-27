import axios from 'axios'

import square, { CreatePaymentLinkRequest } from 'square'
import { v4 as uuidv4 } from 'uuid'
import environments from '../config/environments.js'
import { ILoyaltyProgram } from '../Model/interface/ILoyaltyProgram.js'

// Set Square credentials
const accessToken = environments.SQUARE_ACCESS_TOKEN
const environment = 'sandbox'

// Determine base URL based on environment
const baseURL =
	environment === 'sandbox'
		? 'https://connect.squareupsandbox.com'
		: 'https://connect.squareup.com'

const squareClient = new square.Client({
	environment: square.Environment.Production,
	accessToken: environments.SQUARE_ACCESS_TOKEN,
})

export async function createSquareAccount(data: {
	givenName: string
	email: string
	reference_id: string
	note: string
}) {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
				// 'Square-Version': squareVersion,
			},
		}

		const requestData = {
			given_name: data.givenName,
			// family_name: data.familyName,
			email_address: data.email,
			// address: {
			// 	address_line_1: data.address.addressLine1,
			// 	address_line_2: data.address.addressLine2,
			// 	locality: data.address.locality,
			// 	administrative_district_level_1: 'NY',
			// 	postal_code: data.address.postalCode,
			// 	country: data.address.country,
			// },
			// phone_number: data.phoneNumber,
			reference_id: data.reference_id,
			note: data.note,
		}

		const response = await axios.post(
			`https://connect.squareupsandbox.com/v2/customers`,
			requestData,
			config
		)

		return response.data.customer.id
	} catch (error) {
		console.error(error)
		throw error
	}
}

/**
 *
 * @deprecated - Use SquareService.processPayment instead
 */
export async function processPayment(
	amount: number,
	currency: string,
	cnon: string,
	userId: string
) {
	// Create request data
	const requestData = {
		source_id: cnon, //cnon id/card id
		amount_money: {
			amount: amount * 100, //converting to cents
			currency: currency,
		},
		idempotency_key: uuidv4(),
		// customerId: environments.SQUARE_ADMIN_CUSTOMER_ID, // admin id of customer
		referenceId: userId.toString(),
	}

	const config = {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
	}

	try {
		// Make Axios POST request
		const response = await axios.post(
			`${baseURL}/v2/payments`,
			requestData,
			config
		)
		return response.data
	} catch (error) {
		console.error('Error processing payment:', error)
		throw error
	}
}

const SquareService = {
	generateLinkForLoyaltyProgram: async (data: ILoyaltyProgram.Create) => {
		const durationData = SquareService._LoyaltyDescription(data.duration)

		const amountInCents = durationData.amount.amount * 100 // Convert to cents

		const body: CreatePaymentLinkRequest = {
			idempotencyKey: uuidv4(), // Ensure this is unique for each request
			quickPay: {
				name: durationData.name,
				priceMoney: {
					amount: BigInt(Math.round(amountInCents)),
					currency: 'USD',
				},
				locationId: environments.SQUARE_LOCATION_ID,
			},
			description: durationData.description,
			prePopulatedData: {
				buyerEmail: data.email,
				buyerAddress: {
					addressLine1: data.personalInfo.address.streetAddress,
					locality: data.personalInfo.address.city,
					administrativeDistrictLevel1: data.personalInfo.address.state,
					postalCode: data.personalInfo.address.zipCode,
					lastName: data.personalInfo.lastName,
					firstName: data.personalInfo.firstName,
				},
				buyerPhoneNumber: data.personalInfo.phoneNumber,
			},
		}

		console.log({ body })

		const link = await squareClient.checkoutApi.createPaymentLink(body)

		console.log({ link: link.result.paymentLink?.url })

		return link.result.paymentLink
	},

	processPayment: async (data: {
		amount: number
		currency: string
		cnon: string
		userId: string
	}) => {
		// Create request data
		const requestData = {
			source_id: data.cnon,
			amount_money: {
				amount: data.amount * 100,
				currency: data.currency,
			},
			idempotency_key: uuidv4(),

			referenceId: data.userId.toString(),
		}

		const config = {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		}

		try {
			// Make Axios POST request
			const response = await axios.post(
				`${baseURL}/v2/payments`,
				requestData,
				config
			)
			return response.data
		} catch (error) {
			console.error('Error processing payment:', error)
			throw error
		}
	},

	_LoyaltyDescription: (type: ILoyaltyProgram.Model['duration']) => {
		switch (type) {
			case 'oneYear':
				return {
					amount: { amount: 19.99, currency: 'USD' },

					name: 'One Year Exclusive Membership',
					description: 'Be a part of our exclusive membership for one year',
				}
			case 'twoYear':
				return {
					name: 'Two Year Exclusive Membership',
					amount: { amount: 24.99, currency: 'USD' },
					description: 'Be a part of our exclusive membership for two years',
				}
			case 'threeYear':
				return {
					name: 'Three Year Exclusive Membership',
					amount: { amount: 29.99, currency: 'USD' },
					description: 'Be a part of our exclusive membership for three years',
				}
			default:
				throw new Error('Invalid duration')
		}
	},
}

export default SquareService

//pushed
export function getCustomers() {}
