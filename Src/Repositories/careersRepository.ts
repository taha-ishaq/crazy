import ConfigVars from '../config/configVariables.js'
import environments from '../config/environments.js'
import { IJobApplicationModule } from '../Model/interface/IJobApplication.js'
import jobApplicationModel from '../Model/jobApplicationModel.js'
import { ImageService } from '../services/imageKitService.js'
import sendEmail from '../utils/mail.js'

const imageService = new ImageService()
class CareerRepository {
	public async createApplication() {
		await sendEmail({
			from: 'Crazy By Rasel',
			to: 'muhamadkhuram1999@gmail.com',
			subject: 'New Job Application',
			text: 'A new job application has been submitted',
		})
	}
	private formatKey(key: string): string {
		// Split the key by capital letters or underscore
		const words = key.split(/(?=[A-Z])|_/)
		// Capitalize the first letter of each word and join them with a space
		return words
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}
	public async sendEmailToAdmin(
		data: IJobApplicationModule.ICreateJobApplication
	) {
		const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Application</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 10px;
        }
        .section-title {
            text-align: center;
        }
        .content-block {
            margin-bottom: 20px;
        }
        .content-block h4 {
            width: 100%;
            padding-bottom: 0;
            margin: 0;
        }
        .content-block p {
            padding-bottom: 10px;
            margin: 0;
        }
        @media only screen and (max-width: 600px) {
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="section-title">New Job Application</h1>
        <h2>Applicant Information</h2>
        <div class="content-block">
            ${Object.entries(data.information)
							.map(
								([key, value]) => `
                    <div class="content-block">
                        <h4><strong>${this.formatKey(key)}</strong></h4>
                        <p>${this.booleanHandler(value)}</p>
                    </div>
                `
							)
							.join('')}
        </div>
        <h2>Education</h2>
        ${
					data.education.degree
						? `<div class="content-block"><p>${data.education.degree}</p></div>`
						: ''
				}
        <div class="content-block">
            <p>High School: ${data.education.highSchool.name} (${
			data.education.highSchool.from
		} - ${data.education.highSchool.to})</p>
        </div>
        ${
					data.education.college
						? `
            <div class="content-block">
                <p>College: ${data.education.college.name} (${data.education.college.from} - ${data.education.college.to})</p>
            </div>
        `
						: ''
				}

        ${
					data.employmentHistory
						? `
            <h2>Employment History</h2>
            ${data.employmentHistory
							.map(
								(employment) => `
                <div class="content-block">
                    <h4><strong>Company:</strong></h4>
                    <p>${employment.company}</p>
                    <h4><strong>Job Title:</strong></h4>
                    <p>${employment.jobTitle}</p>
                    <h4><strong>From:</strong></h4>
                    <p>${employment.from}</p>
                    <h4><strong>To:</strong></h4>
                    <p>${employment.to}</p>
                </div>
            `
							)
							.join('')}
        `
						: ''
				}

        ${
					data.references
						? `
            <h2>References</h2>
            ${data.references
							.map(
								(reference) => `
                <div class="content-block">
                    <h4><strong>Name:</strong></h4>
                    <p>${reference.fullName}</p>
                    <h4><strong>Relationship:</strong></h4>
                    <p>${reference.relationship}</p>
                    <h4><strong>Company:</strong></h4>
                    <p>${reference.company}</p>
                    <h4><strong>Phone:</strong></h4>
                    <p>${reference.phone}</p>
                    <h4><strong>Address:</strong></h4>
                    <p>${reference.address}</p>
                </div>
            `
							)
							.join('')}
        `
						: ''
				}

        ${
					data.militaryService
						? `
            <h2>Military Service</h2>
            ${Object.entries(data.militaryService)
							.map(
								([key, value]) => `
                <div class="content-block">
                    <h4><strong>${this.formatKey(key)}:</strong></h4>
                    <p>${this.booleanHandler(value)}</p>
                </div>
            `
							)
							.join('')}
        `
						: ''
				}

        <h2>Emergency Contact</h2>
        ${Object.entries(data.emergencyContact)
					.map(
						([key, value]) => `
            <div class="content-block">
                <h4><strong>${this.formatKey(key)}:</strong></h4>
                <p>${this.booleanHandler(value)}</p>
            </div>
        `
					)
					.join('')}
    </div>
</body>
</html>
`
		await sendEmail(
			{
				from: environments.CareerMail,
				to: ConfigVars.adminEmails(),
				subject: 'Job Application Received',
				html: htmlContent,
			},
			{
				user: environments.CareerMail,
				pass: environments.CareerMailPass,
			}
		)
	}

	public async sendEmailToApplicant(
		data: IJobApplicationModule.ICreateJobApplication
	) {
		const htmlContentForApplicant = `<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>New Job Application</title>
		</head>
		<body>
		<h2>Respected ${data.information.firstName} ${data.information.lastName}!</h2>
		<p>Your application has been sent Successfully for Crazy By Rasel</p>

		
		</body>
		
		</html>`
		await sendEmail(
			{
				from: environments.CareerMail,
				to: data.information.email,
				subject: 'Job Application Sent',
				html: htmlContentForApplicant,
			},
			{
				user: environments.CareerMail,
				pass: environments.CareerMailPass,
			}
		)
	}
	public async sendJobApplication(
		data: IJobApplicationModule.ICreateJobApplication,
		file: Express.Multer.File
	) {
		if (!data) {
			throw new Error(
				'Unable to process job application: Missing required data.'
			)
		}
		// uploading cv to ImageKit
		if (file) {
			const Url = await imageService.upload(file, ['cv'])

			if (!Url) {
				throw new Error(
					'Unable to process job application: Failed to upload cv.'
				)
			}

			data.information.cvUrl = Url
		}

		const application = await jobApplicationModel.create(data)

		if (!application) {
			throw new Error(
				'Unable to process job application: Failed to create application.'
			)
		}
		return application
	}
	//to handle true and false on the user interface
	booleanHandler(val: any) {
		if (val === undefined) return 'Not Available'

		if (val === false) return 'No'

		if (val === true) return 'Yes'

		return val
	}
}

export default new CareerRepository()
