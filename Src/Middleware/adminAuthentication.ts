import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import environments from '../config/environments.js'
import Admin from '../Model/adminModel.js'

const adminAuthentication = {
	passport: async (req: Request, res: Response, next: NextFunction) => {
		try {
			let token: any
			if (
				req.headers.authorization &&
				req.headers.authorization.startsWith('Bearer')
			) {
				token = req.headers.authorization.split(' ')[1]
			}

			if (!token) {
				return res.status(401).json({ Error: 'You are not logged in!' })
			}

			const verifyJwt: any = promisify(jwt.verify)
			const decodedPayload: any = await verifyJwt(
				token,
				environments.JWT_SECRET
			)

			const currentAdmin = await Admin.findById(decodedPayload.id).lean()
			if (!currentAdmin) {
				return res
					.status(404)
					.json({ Error: 'User belongs to the token does not exist' })
			}

			req.admin = currentAdmin
			next()
		} catch (error) {
			if (error instanceof Error) {
				return res.status(401).json({ Error: error.message })
			}
			if (error instanceof jwt.TokenExpiredError) {
				return res.status(401).json({ message: 'Token has expired.' })
			}
			return res.status(401).json({ Error: error.message })
		}
	},
	//  Authorization
	restricted: (...roles: any) => {
		return (req: Request, res: Response, next: NextFunction) => {
			// roles = ['admin']
			if (!roles.includes(req.user.role)) {
				return res.status(403).json({
					Error: 'You dont have permission to perform this operation',
				})
			}

			next()
		}
	},
}

export default adminAuthentication
