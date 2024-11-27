import { Request, Response } from 'express'
import {
	default as CouponRepository,
	default as couponRepository,
} from '../Repositories/couponRepository.js'
import { returnError } from '../utils/resUtils.js'
const CouponController = {
	createCoupons: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin?._id
			const { data } = req.body
			if (!data.count) {
				data.count = 1
			}
			const logo = req.files
				? req.files['logo']
					? req.files['logo'][0]
					: ''
				: ''
			const { category } = req.query
			const createdCoupons = await couponRepository.createCoupons(
				adminId,
				logo,
				data as any,
				category as string
			)
			return res.status(200).json({
				success: true,
				createdCoupons,
				message: 'coupon created successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
	getCouponByAdmin: async (req: Request, res: Response) => {
		try {
			const adminId = req.admin._id
			const { limit, page } = req.query
			const coupons = await couponRepository.getCouponByAdmin(
				adminId,
				Number(page),
				Number(limit)
			)
			res.status(201).json({ success: true, coupons })
		} catch (error) {
			returnError(req, res, error)
		}
	},

	getCouponsWithStatus: async (req: Request, res: Response) => {
		try {
			const userId = req.user?._id
			const { activeCoupons, inactiveCoupons } =
				await CouponRepository.getCouponsWithStatus(userId)
			return res.json({ success: true, activeCoupons, inactiveCoupons })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	couponByUserId: async (req: Request, res: Response) => {
		try {
			const coupons = await CouponRepository.couponByUserId(req.user?._id)
			return res.json({ success: true, coupons })
		} catch (error) {
			returnError(req, res, error)
		}
	},
	deleteCoupon: async (req: Request, res: Response) => {
		try {
			const { couponId } = req.query
			const deleted = await couponRepository.deleteCoupon(couponId as string)
			res.status(201).json({
				success: true,
				deleted,
				message: 'coupon deleted successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default CouponController
