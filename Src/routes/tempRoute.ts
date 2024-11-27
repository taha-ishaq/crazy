import express, { Request, Response } from 'express'
import environments from '../config/environments.js'
import HTMLUtils from '../Constant/HtmlUtils.js'
import LoyaltyProgramUserModel from '../Model/LoyaltyProgramUser.Model.js'
import SquareService from '../services/square.Service.js'
import sendEmail from '../utils/mail.js'
import { returnError } from '../utils/resUtils.js'
const tempRoute = express.Router()

tempRoute.post('/send-temp-email', async (_: Request, res: Response) => {
	const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Visit Our Store</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f8f8f8;
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 10px 0;
                }
                .header h1 {
                    margin: 0;
                    color: #62be12;
                }
                .content {
                    margin: 20px 0;
                }
                .content p {
                    line-height: 1.6;
                }
                .table-container {
                    margin: 20px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th,
                td {
                    padding: 10px;
                    text-align: center;
                    border: 1px solid #dddddd;
                }
                th {
                    background-color: #62be12;
                    color: #ffffff;
                }
                .cta {
                    text-align: center;
                    margin: 20px 0;
                }
                .cta a {
                    background-color: #62be12;
                    color: #ffffff;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #777777;
                }
                .logo img {
                    max-width: 50px;
                    height: auto;

                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Crazy By Rasel!</h1>
                </div>
                <div class="content">
                    <p>Dear Valued Customer,</p>
                    <p>
                        We are thrilled to invite you to visit our store, where you will find
                        the best prices within a 100-mile radius. Our wide selection of
                        products ensures that you will find exactly what you need, all at
                        unbeatable prices.
                    </p>
                    <p>
                        At Crazy By Rasel, we pride ourselves on offering top-notch quality
                        and exceptional customer service. Whether you are shopping for
                        essentials or looking for something special, our friendly staff is
                        here to assist you.
                    </p>
                </div>
                <div class="table-container">
                    <table>
                        <tr>
                            <th>Company</th>
                            <th>Old Price</th>
                            <th>New Price</th>
                        </tr>
                        <tr>
                            <td class="logo">
                                <a href="https://crazybyrasel.com/" target="_blank">
                                    <img src="https://res.cloudinary.com/de90d6t6e/image/upload/v1713855949/crazyByRasel/Gas%20Stations/te1x6uzq4kezhd85uz8b.png" alt="Company 1 Logo" />
                                </a>
                            </td>
                            <td>$20.00</td>
                            <td>$15.00</td>
                        </tr>
                        <tr>
                            <td class="logo">
                                <a href="https://crazybyrasel.com/" target="_blank">
                                    <img src="https://res.cloudinary.com/de90d6t6e/image/upload/v1713855949/crazyByRasel/Gas%20Stations/gw5jisdzabcxgfzqowdi.png" alt="Company 2 Logo" />
                                </a>
                            </td>
                            <td>$30.00</td>
                            <td>$25.00</td>
                        </tr>
                        <tr>
                            <td class="logo">
                                <a href="https://crazybyrasel.com/" target="_blank">
                                    <img src="https://res.cloudinary.com/de90d6t6e/image/upload/v1713855949/crazyByRasel/Gas%20Stations/gw5jisdzabcxgfzqowdi.png" alt="Company 3 Logo" />
                                </a>
                            </td>
                            <td>$50.00</td>
                            <td>$40.00</td>
                        </tr>
                    </table>
                </div>
                <div class="cta">
                    <a href="https://crazybyrasel.com/" target="_blank">Visit Our Store Today!</a>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Crazy By Rasel. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    


    `
	await sendEmail({
		from: environments.Mail,
		to: [
			'jkb634915@gmail.com',
			'ranaalihaider9696@gmail.com',
			'muhamadkhuram207@gmail.com',
			'muhamadkhuram1999@gmail.com',
		],
		subject: 'One More for Extra Savings!',
		html: htmlContent,
	})
	res.json({ success: true, message: 'email sent successfully' })
})

tempRoute.post('/loyalty-email', async (req, res) => {
	try {
		const { id } = req.body
		const data = await LoyaltyProgramUserModel.findById(id)
		if (!data) {
			return res.status(404).json({ success: false, message: 'User not found' })
		}

		let htmlContentForUser = ``

		if (data.payment?.paid) {
			htmlContentForUser =
				HTMLUtils.customerLoyaltyEmailWithoutPaymentLink(data)
		} else {
			htmlContentForUser =
				HTMLUtils.customerLoyaltyEmailWithoutPaymentLink(data)
		}

		await sendEmail(
			{
				from: environments.NoReplyMail,
				to: data.email,
				subject: 'Loyalty Program Signed Up',
				html: htmlContentForUser,
			},
			{
				user: environments.NoReplyMail,
				pass: environments.NoReplyMailPass,
			}
		)

		res.json({ success: true })
	} catch (error) {
		returnError(req, res, error)
	}
})

tempRoute.post('/generate-payment', async (req, res) => {
	try {
		const { id } = req.body

		const loyaltyProgramUser = await LoyaltyProgramUserModel.findById(id)

		if (!loyaltyProgramUser) {
			return res.status(404).json({ success: false, message: 'User not found' })
		}

		const link = await SquareService.generateLinkForLoyaltyProgram(
			loyaltyProgramUser
		)

		res.json({ success: true, data: link })
	} catch (error) {
		returnError(req, res, error)
	}
})

export default tempRoute
