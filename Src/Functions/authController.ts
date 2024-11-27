import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongoose'
import environments from '../config/environments.js'
import authRepository from '../Repositories/authRepository.js'
import EmailUtils from '../utils/emailUtils.js'
import { returnError } from '../utils/resUtils.js'
const signToken = (id: ObjectId | undefined) => {
	return jwt.sign({ id }, environments.JWT_SECRET, {
		expiresIn: environments.JWT_EXPIRESIN,
	})
}
const authController = {
	register: async (req: Request, res: Response) => {
		try {
			const { email, fullName, phone, password } = req.body

			const user = await authRepository.register({
				email,
				fullName,
				phone,
				password,
			})

			const response = await EmailUtils.sendOTPEmail(user)

			if (response?.success === false) {
				res.json({ success: false, message: response.message })
			} else if (response?.success === true) {
				res.json({ success: true, message: response.message, user })
			}
		} catch (error) {
			returnError(req, res, error)
		}
	},
	otpVerification: async (req: Request, res: Response) => {
		try {
			const { OTP, email } = req.body

			const user = await authRepository.emailVerification(OTP, email)
			const token = signToken(user?._id)
			return res.status(200).json({
				success: true,
				token,
				user,
				message: 'OTP Matched',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	loginEmail: async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body

			const user = await authRepository.loginEmail(email, password)

			const token = signToken(user._id)

			return res.status(200).json({
				success: true,
				token,
				user,
				message: 'You have logged in successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	forgetPasswordEmail: async (req: Request, res: Response) => {
		try {
			const { email } = req.body

			const user = await authRepository.checkForgetPassword(email)
			const response = await EmailUtils.sendOTPEmail(user)

			if (response?.success === false) {
				res.json({ success: false, message: response.message })
			} else if (response?.success === true) {
				res.json({ success: true, message: response.message, user })
			}
		} catch (error) {
			returnError(req, res, error)
		}
	},

	resetPasswordEmail: async (req: Request, res: Response) => {
		try {
			const { email, userOTP, newPassword } = req.body

			const message = await authRepository.resetPassword({
				email,
				userOTP,
				newPassword,
			})

			return res.status(200).json(message)
		} catch (error) {
			returnError(req, res, error)
		}
	},

	googleSignIn: async (req: Request, res: Response) => {
		try {
			const { IdToken } = req.body

			const user = await authRepository.signInWithGoogle(IdToken)

			const token = signToken(user?._id)
			res.json({
				success: true,
				user,
				token,
				message: 'You have signed in successfully',
			})
		} catch (error) {
			console.error(error)

			returnError(req, res, error)
		}
	},
}

export default authController
