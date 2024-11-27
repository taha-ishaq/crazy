import express from 'express'
import CareersController from '../Functions/careersController.js'
import vacancyController from '../Functions/jobController.js'
import { multipleFileWithMultipleFieldsUploadMiddleware } from '../services/cloudinaryService.js'

const careersRoute = express.Router()

careersRoute.post(
	'/send-job-application',
	multipleFileWithMultipleFieldsUploadMiddleware([{ name: 'cv', maxCount: 1 }]),
	CareersController.sendJobApplication
)
careersRoute.get('/jobs', vacancyController.getAllJobsForVisitor)

export default careersRoute
