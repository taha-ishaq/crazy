import { ChangeStreamDocument } from 'mongodb'
import environments from '../config/environments.js'
import HTMLUtils from '../Constant/HtmlUtils.js'
import { ILoyaltyProgram } from '../Model/interface/ILoyaltyProgram.js'
import IntlUtil from '../utils/IntlUtils.js'
import sendEmail from '../utils/mail.js'

const loyaltyProgramListener = async (
	data: ChangeStreamDocument<ILoyaltyProgram.Model>
) => {
	if (environments.APPLICATION_STATUS === 'dev') {
		return
	}

	try {
		if (data.operationType === 'insert') {
			console.log('LoyaltyProgramUser created')

			// Send email to admin
			const htmlContentForAdmin = `
			<html>
			<head>
				<title>New Loyalty Program User</title>
			</head>
			<body>
			<h2>Respected Admin!</h2>
			<p>A new user has signed up for the loyalty program.</p>
			<h2>Name</h2>
			<p>${data.fullDocument.personalInfo.firstName} ${
				data.fullDocument.personalInfo.lastName
			}</p>
			<h2>Email</h2>
			<p>${data.fullDocument.email}</p>
			<h2>Phone</h2>
			<p>${data.fullDocument.personalInfo.phoneNumber}</p>
			<h2>Date of birth</h2>
			<p>${IntlUtil.formatDate(data.fullDocument.personalInfo.dateOfBirth)}</p>
			<h2>Plan</h2>
			<p>${planName(data.fullDocument.duration)}</p>
			<h2>Address</h2>
			<p>${data.fullDocument.personalInfo.address.streetAddress}</p>
			</body>
			</html>`
			sendEmail(
				{
					from: environments.NoReplyMail,
					to: ['muhamadkhuram1999@gmail.com', 'rasel@therasel.com'],
					subject: 'New Loyalty Program Member',
					html: htmlContentForAdmin,
				},
				{
					user: environments.NoReplyMail,
					pass: environments.NoReplyMailPass,
				}
			)

			// Send email to user
			let htmlContentForUser = ``

			if (data.fullDocument.payment?.paid) {
				htmlContentForUser = HTMLUtils.customerLoyaltyEmailWithoutPaymentLink(
					data.fullDocument
				)
			} else {
				htmlContentForUser = HTMLUtils.customerLoyaltyEmailWithoutPaymentLink(
					data.fullDocument
				)
			}

			await sendEmail(
				{
					from: environments.NoReplyMail,
					to: data.fullDocument.email,
					subject: 'Loyalty Program Signed Up',
					html: htmlContentForUser,
				},
				{
					user: environments.NoReplyMail,
					pass: environments.NoReplyMailPass,
				}
			)
		}

		if (data.operationType === 'update') {
			console.log('application updated')
		}
	} catch (e) {
		console.error(e)
	}
}

function planName(duration: ILoyaltyProgram.Model['duration']) {
	switch (duration) {
		case 'oneYear':
			return 'One Year'
		case 'twoYear':
			return 'Two Year'
		case 'threeYear':
			return 'Three year'
	}
}

export default loyaltyProgramListener
