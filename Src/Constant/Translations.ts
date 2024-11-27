const Translations = {
	userWithEmailAlreadyExist: (lang: 'en') => {
		const phrases = {
			en: 'Oops! It looks like this email is already registered. If you already have an account, please log in',
		}
		return phrases[lang] || phrases.en
	},
	userWithPhoneAlreadyExist: (lang: 'en') => {
		const phrases = {
			en: 'Oops! It looks like this phone is already registered. If you already have an account, please log in',
		}
		return phrases[lang] || phrases.en
	},
	emailAndPasswordRequired: (lang: 'en') => {
		const phrases = {
			en: 'Oops! Please enter your email and password to log in',
		}
		return phrases[lang] || phrases.en
	},
	phoneAndPasswordRequired: (lang: 'en') => {
		const phrases = {
			en: 'Oops! Please enter your login Credentials to log in',
		}
		return phrases[lang] || phrases.en
	},
	userNotFound: (lang: 'en') => {
		const phrases = {
			en: 'Oops! User not found',
		}
		return phrases[lang] || phrases.en
	},
	beforeResetFirstVerify: (lang: 'en') => {
		const phrases = {
			en: 'Please first verify your account to reset your password',
		}
		return phrases[lang] || phrases.en
	},
	emailOrPasswordIncorrect: (lang: 'en') => {
		const phrases = {
			en: 'Oops! The email or password you entered is incorrect. Please try again',
		}
		return phrases[lang] || phrases.en
	},
	phoneOrPasswordIncorrect: (lang: 'en') => {
		const phrases = {
			en: 'Oops! The phone number or password you entered is incorrect. Please try again',
		}
		return phrases[lang] || phrases.en
	},
	verifyYourAccount: (lang: 'en') => {
		const phrases = {
			en: 'Please verify your account before logging in. Thank you!',
		}
		return phrases[lang] || phrases.en
	},
	deactivateAccount: (lang: 'en') => {
		const phrases = {
			en: 'Your account has been deactivated as per your request',
		}
		return phrases[lang] || phrases.en
	},
	userDidNotExist: (lang: 'en') => {
		const phrases = {
			en: 'User Not Found. Please Verify Your Email or Sign Up for an Account',
		}
		return phrases[lang] || phrases.en
	},
	oneTimeOTPUseOnce: (lang: 'en') => {
		const phrases = {
			en: 'One-Time Code: Use Once Only. Generate a New OTP',
		}
		return phrases[lang] || phrases.en
	},
	OTPExpired: (lang: 'en') => {
		const phrases = {
			en: 'OTP Expired. Please Generate a New One',
		}
		return phrases[lang] || phrases.en
	},

	incorrectOTP: (lang: 'en') => {
		const phrases = {
			en: 'Incorrect OTP. Please Enter the Correct OTP',
		}
		return phrases[lang] || phrases.en
	},
	jwtTokenNotFound: (lang: 'en') => {
		const phrases = {
			en: 'You are not logged in.Please log in first',
		}

		return phrases[lang] || phrases.en
	},
	currentPasswordNotCorrect: (lang: 'en') => {
		const phrases = {
			en: 'Please Provide Your Current Password Correctly for Verification',
		}
		return phrases[lang] || phrases.en
	},
	provideEmail: (lang: 'en') => {
		const phrases = {
			en: 'Please Provide Your Correct Email Address',
		}
		return phrases[lang] || phrases.en
	},
	passwordResetSuccesfully: (lang: 'en') => {
		const phrases = {
			en: 'Password Reset Successful. Log in with Your New Password!',
		}
		return phrases[lang] || phrases.en
	},
	enterProductName: (lang: 'en') => {
		const phrases = {
			en: 'Please Enter Product Name You are trying to search',
		}
		return phrases[lang] || phrases.en
	},
	enterBusinessName: (lang: 'en') => {
		const phrases = {
			en: 'Please Enter Business Name You are trying to search',
		}
		return phrases[lang] || phrases.en
	},
	OTPVerify: (lang: 'en') => {
		const phrases = {
			en: 'Your account has been successfully verified',
		}
		return phrases[lang] || phrases.en
	},
}

export default Translations
