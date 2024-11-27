import environments from '../config/environments.js'
import { IUserModule } from '../Model/interface/IUser.js'
import User from '../Model/User.Model.js'
import sendEmail from './mail.js'

const EmailUtils = {
	sendOTPEmail: async (user: IUserModule.IUserObject) => {
		try {
			const OTP = Math.floor(Math.random() * 900000 + 100000) // Generate a random 6-digit OTP
			const timeToExpires = 2 * 60 * 1000 // 2 minutes in milliseconds
			const expires = Date.now() + timeToExpires

			// user.verifyCredentials.OTP = OTP
			// user.verifyCredentials.OTPExpires = expires
			console.log(user._id, 'from email utils')
			await Promise.all([
				User.findByIdAndUpdate(user._id, {
					$set: {
						'verifyCredentials.OTP': OTP,
						'verifyCredentials.OTPExpires': expires,
					},
				}),
				sendEmail({
					from: environments.Mail,
					to: user.credentialDetails.email,
					subject: 'Verify Your Email with given OTP',
					text: `Your OTP is ${OTP}`,
				}),
			])

			return { success: true, message: 'OTP sent successfully on Your Email' }
		} catch (error) {
			if (error instanceof Error) {
				console.error('Error:', error)
			}

			user.verifyCredentials.OTP = 0
			user.verifyCredentials.OTPExpires = 0
			await user.save()

			return { success: false, message: 'Error sending OTP. Please Try Again' }
		}
	},
}

export default EmailUtils
