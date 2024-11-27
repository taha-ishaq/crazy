import { Request, Response } from 'express'
import environments from '../config/environments.js'
import GuestRepository from '../Repositories/GuestRepository.js'
import sendEmail from '../utils/mail.js'
import { returnError } from '../utils/resUtils.js'

const guestController = {
	contactUsRequestCreate: async (req: Request, res: Response) => {
		try {
			const contactUsRequest = await GuestRepository.contactUsRequestCreate(
				req.body
			)
			await sendEmail({
				from: environments.Mail,
				to: contactUsRequest.email,
				subject: 'Spacial Thanks By Crazy by Rasel',
				html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Contacting Us</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
            max-width: 600px;
        }
        .email-header {
            text-align: center;
            background-color: #C0FF00;
            padding: 20px;
            color: #333333;
            border-radius: 1.5rem;
        }
        .email-header h1 {
            margin: 0;
            font-weight: 700;
        }
        .email-header img {
            max-width: 150px;
            height: auto;
        }
        .email-body {
            padding: 20px;
        }
        .email-body h2 {
            color: #333333;
            font-weight: 600;
        }
        .email-body p {
            line-height: 1.6;
            color: #555555;
        }
        .email-footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="https://res.cloudinary.com/de90d6t6e/image/upload/v1718428970/crazyByRasel/App%20logo/auz1zfc8hczng2lhvhab.png" alt="Crazy by Rasel Logo">
            <h1>Crazy by Rasel</h1>
        </div>
        <div class="email-body">
            <h2>Thank You for Contacting Us!</h2>
            <p>Dear Customer,</p>
            <p>Thank you for reaching out to us at Crazy by Rasel. We have received your message and our team will get back to you as soon as possible.</p>
            <p>We appreciate your interest in our company and look forward to assisting you.</p>
            <p>Best Regards,<br>The Crazy by Rasel Team</p>
        </div>
        <div class="email-footer">
            <p>Copyright &copy; 2021 Crazy by Rasel. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`,
			})
			res.status(200).json({
				success: true,
				contactUsRequest,
				message: 'Your messaged has been sent Successfully!!',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}
export default guestController
