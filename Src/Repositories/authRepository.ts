import bcrypt from 'bcryptjs'
import { firebaseAdmin } from '../config/firebase.js'
import Translations from '../Constant/Translations.js'
import User from '../Model/User.Model.js'
import { createSquareAccount } from '../services/square.Service.js'
class authRepository {
	public async register(data: {
		email: string
		fullName: string
		phone: string
		password: string
	}) {
		if (!data.email || !data.fullName || !data.phone || !data.password) {
			throw Error('Missing Required Credentials')
		}
		const checkUser = await User.findOne({
			'credentialDetails.email': data.email,
		}).lean()
		if (checkUser?.verifyCredentials.emailVerifyStatus === false) {
			return checkUser
		}

		if (checkUser?.verifyCredentials.emailVerifyStatus === true) {
			throw Error(Translations.userWithEmailAlreadyExist('en'))
		}

		const user = await User.create({
			personalInformation: {
				fullName: data.fullName,
				phoneNumber: data.phone,
			},
			credentialDetails: {
				email: data.email,
				password: data.password,
			},
			verifyCredentials: {
				emailVerifyStatus: false,
			},
		})

		if (!user.wallet.square.squareId) {
			const squareId = await createSquareAccount({
				givenName: data.fullName,
				email: data.email,
				reference_id: user._id.toString(),
				note: `customer created for TigerIT app with tigerIT id ${user._id.toString()}`,
			})

			user.wallet.square.squareId = squareId
			await user.save()
		}

		return user
	}

	public async emailVerification(OTP: number, email: string) {
		if (!OTP || !email) {
			throw Error('Missing Required data(OTP,email)')
		}

		// Checking User
		const user = await User.findOne({
			'credentialDetails.email': email,
		}).select('+verifyCredentials.OTP +verifyCredentials.OTPExpires')

		if (!user) {
			throw Error('User Not Found')
		}
		// User found Get Real OTP from database
		let realOTP = user.verifyCredentials.OTP
		let expireTime = user.verifyCredentials.OTPExpires
		if (!realOTP) {
			throw Error('One-Time Code: Use Once Only. Generate a New OTP')
		}

		let date = Date.now()

		if (date > Number(expireTime)) {
			throw Error('OTP Expired. Please Generate a New One')
		}

		// Verify OTP
		if (Number(OTP) !== realOTP) {
			throw Error('Incorrect OTP. Please Enter the Correct OTP')
		}

		return await User.findByIdAndUpdate(
			user._id,
			{
				$set: {
					'verifyCredentials.emailVerifyStatus': true,
				},
			},
			{ new: true }
		)
	}

	public async loginEmail(email: string, password: string) {
		if (!email || !password) {
			throw Error('Missing Email or Password')
		}

		const checkUser = await User.findOne({
			'credentialDetails.email': email,
		}).select('+credentialDetails.password')

		if (!checkUser) {
			throw Error('Incorrect credential Details')
		}
		if (!checkUser.verifyCredentials.emailVerifyStatus) {
			throw Error('Email Account is not verify.Please Verify first')
		}

		const correct = await bcrypt.compare(
			password,
			checkUser.credentialDetails.password
		)

		if (!correct) {
			throw Error('Incorrect credential Details')
		}
		if (!checkUser.accountActive) {
			throw Error('Your account has been blocked.Contact admin to unblock')
		}

		const logedInUser = await User.findOne({
			'credentialDetails.email': email,
		}).lean()
		if (!logedInUser) {
			throw Error('Incorrect credential Details')
		}
		return logedInUser
	}

	public async checkForgetPassword(email: string) {
		if (!email) {
			throw Error('Missing email address')
		}

		const checkUser = await User.findOne({ 'credentialDetails.email': email })

		if (!checkUser) {
			throw Error('Invalid Email Address.User not found')
		}

		if (!checkUser.verifyCredentials.emailVerifyStatus) {
			throw Error('Your account is not verified.Please Verify First')
		}

		return checkUser
	}

	public async resetPassword(data: {
		email: string
		userOTP: number
		newPassword: string
	}) {
		const { email, userOTP, newPassword } = data

		if (!email || !userOTP || !newPassword) {
			throw Error('Missing Required Credentials(email,otp,new password)')
		}
		const user = await User.findOne({
			'credentialDetails.email': email,
		}).select('+verifyCredentials.OTP +verifyCredentials.OTPExpires')

		if (!user) {
			throw Error(Translations.userDidNotExist('en'))
		}

		// If user exist get OTP
		let realOTP = user.verifyCredentials.OTP
		let expiresTime = user.verifyCredentials.OTPExpires

		if (!realOTP) {
			throw Error(Translations.oneTimeOTPUseOnce('en'))
		}

		// Check expires time
		let date = Date.now()

		if (date > Number(expiresTime)) {
			throw Error(Translations.OTPExpired('en'))
		}

		// Verify OTP
		if (Number(userOTP) === realOTP) {
			user.verifyCredentials.OTP = 0
			user.verifyCredentials.OTPExpires = 0
			user.credentialDetails.password = newPassword
			await user.save()

			return {
				success: true,
				message: Translations.passwordResetSuccesfully('en'),
			}
		} else {
			throw Error(Translations.incorrectOTP('en'))
		}
	}

	public async signInWithGoogle(IdToken: string) {
		const decodedToken = await firebaseAdmin.auth().verifyIdToken(IdToken)
		const userOnFirebase = await firebaseAdmin.auth().getUser(decodedToken.uid)

		// console results
		// decodedToken : {
		// 	name: 'Qulbe Hussain Vlogs',
		// 	picture: 'https://lh3.googleusercontent.com/a/ACg8ocLPz3-t_7GdMSvF8FJXXOJeIAVufpgCy5ZI9eLEa8V_nvtxJ58=s96-c',
		// 	iss: 'https://securetoken.google.com/crazybyrasel',
		// 	aud: 'crazybyrasel',
		// 	auth_time: 1715173160,
		// 	user_id: 'gdqsMvdsXdbWciSX11cJa2PAbRp2',
		// 	sub: 'gdqsMvdsXdbWciSX11cJa2PAbRp2',
		// 	iat: 1715173160,
		// 	exp: 1715176760,
		// 	email: 'qulbehussainbukhari@gmail.com',
		// 	email_verified: true,
		// 	firebase: {
		// 	  identities: { 'google.com': [Array], email: [Array] },
		// 	  sign_in_provider: 'google.com'
		// 	},
		// 	uid: 'gdqsMvdsXdbWciSX11cJa2PAbRp2'
		//   }
		//   userOnFirebase : UserRecord {
		// 	uid: 'gdqsMvdsXdbWciSX11cJa2PAbRp2',
		// 	email: 'qulbehussainbukhari@gmail.com',
		// 	emailVerified: true,
		// 	displayName: 'Qulbe Hussain Vlogs',
		// 	photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocLPz3-t_7GdMSvF8FJXXOJeIAVufpgCy5ZI9eLEa8V_nvtxJ58=s96-c',
		// 	phoneNumber: undefined,
		// 	disabled: false,
		// 	metadata: UserMetadata {
		// 	  creationTime: 'Wed, 08 May 2024 12:59:20 GMT',
		// 	  lastSignInTime: 'Wed, 08 May 2024 12:59:20 GMT',
		// 	  lastRefreshTime: 'Wed, 08 May 2024 12:59:20 GMT'
		// 	},
		// 	providerData: [
		// 	  UserInfo {
		// 		uid: '116450618004884263701',
		// 		displayName: 'Qulbe Hussain Vlogs',
		// 		email: 'qulbehussainbukhari@gmail.com',
		// 		photoURL: 'https://lh3.googleusercontent.com/a/ACg8ocLPz3-t_7GdMSvF8FJXXOJeIAVufpgCy5ZI9eLEa8V_nvtxJ58=s96-c',
		// 		providerId: 'google.com',
		// 		phoneNumber: undefined
		// 	  }
		// 	],
		// 	passwordHash: undefined,
		// 	passwordSalt: undefined,
		// 	tokensValidAfterTime: 'Wed, 08 May 2024 12:59:20 GMT',
		// 	tenantId: undefined
		//   }

		// From sign up
		let existingUser = await User.findOneAndUpdate(
			{ 'credentialDetails.email': userOnFirebase.email },
			{
				$set: {
					'credentialDetails.googleId': decodedToken.uid,
					'credentialDetails.email': userOnFirebase.email,
					'personalInformation.fullName': decodedToken.name,
					'personalInformation.profilePic': decodedToken.picture,
					'verifyCredentials.emailVerifyStatus': true,
					'credentialDetails.password': decodedToken.uid,
					'personalInformation.phoneNumber': userOnFirebase.phoneNumber ?? '',
				},
			},
			{ new: true }
		)

		if (!existingUser) {
			const newUser = new User({
				credentialDetails: {
					googleId: decodedToken.uid,
					email: decodedToken.email,
					password: decodedToken.uid,
				},
				personalInformation: {
					firstName: userOnFirebase.displayName ?? '',
					lastName: '',
					phoneNumber: userOnFirebase.phoneNumber ?? '',
					profilePic: decodedToken.picture,
				},
				verifyCredentials: {
					emailVerifyStatus: true,
				},
			})

			existingUser = await newUser.save()
		}

		return existingUser
	}
}

export default new authRepository()
