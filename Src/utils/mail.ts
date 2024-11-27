import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import environments from '../config/environments.js'
const sendEmail = async (
	options: Mail.Options,
	auth?: {
		user: string
		pass: string
	}
) => {
	try {
		const transporter = nodemailer.createTransport({
			host: 'smtp.titan.email',
			port: 465,
			auth: auth ?? {
				user: environments.Mail,
				pass: environments.MailPass,
			},
		})

		await transporter.sendMail(options)
		console.log('Email sent successfully')
	} catch (error) {
		console.error('Error sending email:', error)
	}
}

export default sendEmail
