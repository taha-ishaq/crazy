import { ILoyaltyProgram } from '../Model/interface/ILoyaltyProgram.js'
import IntlUtil from '../utils/IntlUtils.js'

const HTMLUtils = {
	customerLoyaltyEmailWithoutPaymentLink: (data: ILoyaltyProgram.Model) => {
		return `<html>
        <head>
            <title>New Loyalty Program User</title>
        </head>
        <body>
        <h2>Respected ${data.personalInfo.firstName} ${
			data.personalInfo.lastName
		}!</h2>
        <p>You have successfully signed up for the loyalty program.</p>
        <h2>Name</h2>
        <p>${data.personalInfo.firstName} ${data.personalInfo.lastName}</p>
        <h2>Email</h2>
        <p>${data.email}</p>
        <h2>Phone</h2>
        <p>${data.personalInfo.phoneNumber}</p>
        <h2>Date of birth</h2>
        <p>${IntlUtil.formatDate(data.personalInfo.dateOfBirth)}</p>
        <h2>Plan</h2>
        <p>${HTMLUtils.planName(data.duration)}</p>
        <h2>Address</h2>
        <p>${data.personalInfo.address.streetAddress}</p>
        </body>
        </html>`
	},

	customerLoyaltyEmailWithPaymentLink: (data: ILoyaltyProgram.Model) => {
		return `<html>
        <head>
            <title>New Loyalty Program User</title>
        </head>
        <body>
        <h2>Respected ${data.personalInfo.firstName} ${
			data.personalInfo.lastName
		}!</h2>
        <p>You have successfully signed up for the loyalty program.</p>
        <h2>Name</h2>
        <p>${data.personalInfo.firstName} ${data.personalInfo.lastName}</p>
        <h2>Email</h2>
        <p>${data.email}</p>
        <h2>Phone</h2>
        <p>${data.personalInfo.phoneNumber}</p>
        <h2>Date of birth</h2>
        <p>${IntlUtil.formatDate(data.personalInfo.dateOfBirth)}</p>
        <h2>Plan</h2>
        <p>${HTMLUtils.planName(data.duration)}</p>
        <h2><a href="${HTMLUtils.paymentLink(
					data.duration
				)}">Pay now to activate your membership</a></h2>
        <h2>Address</h2>
        <p>${data.personalInfo.address.streetAddress}</p>
        </body>
        </html>`
	},

	planName: (duration: ILoyaltyProgram.Model['duration']) => {
		switch (duration) {
			case 'oneYear':
				return 'One Year'
			case 'twoYear':
				return 'Two Year'
			case 'threeYear':
				return 'Three year'
		}
	},

	paymentLink: (duration: ILoyaltyProgram.Model['duration']) => {
		switch (duration) {
			case 'oneYear':
				return 'https://square.link/u/lxfK1mNb'
			case 'twoYear':
				return 'https://square.link/u/ltCYJri6'
			case 'threeYear':
				return 'https://square.link/u/eZzvGaeF'
		}
	},
}

export default HTMLUtils
