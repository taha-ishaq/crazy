import express from 'express'
import authController from '../Functions/authController.js'
const authRoute = express.Router()

// Email Auth

// email-signup
authRoute.post('/email-signup', authController.register)
// verify otp
authRoute.post('/verify-otp', authController.otpVerification)
// Login email
authRoute.post('/login-email', authController.loginEmail)
// Forget Password Email
authRoute.post('/forget-password-email', authController.forgetPasswordEmail)
// Reset password email
authRoute.post('/reset-password-email', authController.resetPasswordEmail)

// Google LoginIn
authRoute.post('/google-login', authController.googleSignIn)
//package-lock.json file deleted
export default authRoute
