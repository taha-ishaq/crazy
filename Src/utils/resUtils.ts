// import { captureException } from '@sentry/node'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'

export const returnError = (__: Request, res: Response, error: any) => {
	console.error(error)

	if (res.headersSent) {
		return
	}

	if (error instanceof Error) {
		return res.json({ success: false, code: error, message: error.message })
	}

	if (error instanceof mongoose.MongooseError) {
		return res.json({ success: false, message: error.message })
	}

	if (error instanceof jwt.TokenExpiredError) {
		return res
			.status(401)
			.json({ success: false, message: 'Token has expired.' })
	}

	return
}

// export const sentryCaptureException = (req: Request, error: any) => {
// 	const mb = req.driver ? 'driver' : req.user ? 'passenger' : 'unknown'

// 	captureException(error, {
// 		user: req.user ?? req.driver,
// 		extra: {
// 			requestMadeBy: mb,
// 			path: req.path,
// 			token: req.headers.authorization,
// 			body: req.body,
// 			query: req.query,
// 			params: req.params,
// 			headers: req.headers,
// 		},
// 	})
// }
