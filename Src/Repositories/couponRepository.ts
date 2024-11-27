import mongoose, { ObjectId } from 'mongoose'
import Coupon from '../Model/couponModel.js'

import Admin from '../Model/adminModel.js'
import { ICouponModule } from '../Model/interface/ICoupons.js'
import { uploadToCloudinary } from '../services/cloudinaryService.js'
import buyerRepository from './buyerRepository.js'

class CouponRepository {
	public async createCoupons(
		adminId: string,
		logo: Object & { path: string },
		data: ICouponModule.Create,
		category: string
	) {
		const admin = await Admin.findById(adminId)
		if (!admin) {
			throw new Error('admin not found')
		}
		let newLogoImage = ''
		if (logo && logo.path) {
			const newLogo = await uploadToCloudinary(
				logo.path,
				'crazyByRasel/coupons'
			)
			newLogoImage = newLogo
		}

		const couponPromises = Array.from({ length: data.count }, async () => {
			const couponCode = this.generateCouponCode()
			return Coupon.create({
				title: data.title,
				code: couponCode,
				discountType: data.discountType,
				discountAmount: data.discountAmount,
				minimumPurchaseAmount: data.minimumPurchaseAmount,
				expirationDate: data.expirationDate,
				category: category ?? null,
				logo: newLogoImage,
				creator: {
					type: 'admin',
					id: new mongoose.Types.ObjectId(adminId),
				},
			})
		})

		const createdCoupons = await Promise.all(couponPromises)

		return createdCoupons
	}
	private generateCouponCode(length: number = 8): string {
		const characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		let couponCode = ''

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length)
			couponCode += characters.charAt(randomIndex)
		}

		return couponCode
	}

	public async getCouponByCode(code: string) {
		const coupon = await Coupon.findOne({ code }).lean()

		return coupon
	}
	public async getCouponByAdmin(
		adminID: Object,
		page: number = 1,
		limit: number = 10
	) {
		const coupons = await Coupon.find({ 'creator.id': adminID })
			.limit(limit)
			.skip((page - 1) * limit)
			.lean()
		if (!coupons) throw new Error('Cannot find coupon')

		return coupons
	}
	public async verifyCoupon(code: string) {
		const coupon = await Coupon.findOne({
			code,
			active: true,
			expirationDate: { $gte: new Date() },
		}).lean()

		if (!coupon) {
			throw new Error('invalid coupon')
		}

		return coupon
	}

	public async getCouponsWithStatus(userId: ObjectId) {
		const { cart } = await buyerRepository.cartOfSpecificBuyer(userId)
		const totalOrderAmount = cart.total[cart.total.length - 1].price.amount

		const currentDate = new Date()
		const allCoupons = await Coupon.find({
			$or: [{ userId: undefined }, { userId: userId }],
		}).lean()

		const activeCoupons = allCoupons.filter(
			(coupon) =>
				coupon.active &&
				coupon.expirationDate > currentDate &&
				coupon.minimumPurchaseAmount.amount <= totalOrderAmount
		)

		const inactiveCoupons = allCoupons.reduce((acc: any[], coupon) => {
			if (!coupon.active) {
				acc.push({ coupon, reason: 'Coupon is inactive.' })
			} else if (coupon.expirationDate <= currentDate) {
				acc.push({ coupon, reason: 'Coupon has expired.' })
			} else if (coupon.minimumPurchaseAmount.amount > totalOrderAmount) {
				acc.push({
					coupon,
					reason: 'Coupon requires a higher minimum purchase amount.',
				})
			}
			return acc
		}, [])

		return { activeCoupons, inactiveCoupons }
	}
	public async couponByUserId(userId: ObjectId) {
		const coupon = await Coupon.find({
			$or: [{ userId: undefined }, { userId: userId }],
		})
			.sort({ 'discountAmount.amount': -1 })
			.lean()

		const promises = coupon.map(async (e) => {
			const admin = await Admin.findById(
				e.creator.id,
				'fullName profilePic'
			).lean()

			return Object.assign(e, {
				creator: {
					icon: e.creator.icon,
					type: e.creator.type,
					id: e.creator.id,
					user: {
						title: admin?.fullName || 'Crazy By Rasel',
						image: admin?.profilePic || '',
						category: 'Platform bonus',
					},
				},
			})
		})

		return Promise.all(promises)
	}
	public async deleteCoupon(couponId: string) {
		if (!couponId) throw new Error('couponId is required!')
		const deletedCoupon = await Coupon.findByIdAndDelete(couponId)
		return deletedCoupon
	}
}

export default new CouponRepository()
