import { Request, Response } from 'express'
import CartRepository from '../Repositories/CartRepository.js'
import { returnError } from '../utils/resUtils.js'

const CartController = {
	cart: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { data } = req.query as {
				data: { sellerId: string; couponId: string }[]
			}

			const userCart = await CartRepository.optimizedCart(
				userId,
				data ? JSON.parse(data?.toString()) : null
			)

			return res.status(200).json({
				status: 'success',
				data: userCart,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	updateCart: async (req: Request, res: Response) => {
		try {
			const userId = req.user._id
			const { items, couponInfo } = req.body

			const cart = await CartRepository.updateBuyerCart(
				userId,
				items,
				couponInfo
			)

			return res.status(200).json({
				success: true,
				cart,
				message: 'Cart has been updated successfully',
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},

	productData: async (req: Request, res: Response) => {
		try {
			const { productId, quantity, deliveryType } = req.query

			const data = await CartRepository.buyNowItemDetails({
				productId: productId as any,
				quantity: Number(quantity),
				deliveryType: deliveryType as any,
			})

			return res.status(200).json({
				status: 'success',
				data,
			})
		} catch (error) {
			returnError(req, res, error)
		}
	},
}

export default CartController
