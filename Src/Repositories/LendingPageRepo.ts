import connectionModel from '../Model/connectionModel.js'
import { IConnectionModels } from '../Model/interface/IConnections.js'

class lendingPageRepo {
	public async addConnections(data: IConnectionModels.Iconnection) {
		if (!data) {
			throw new Error('Invalid Data Input!!')
		}
		const connection = await connectionModel.create(data)
		return connection
	}
	public async getAllConnections() {
		const connections = await connectionModel.find().lean()
		if (connections.length <= 0) return 'connection not found'
		return connections
	}
	public async connectionById(id: string) {
		const connection = await connectionModel.findById(id).lean()
		if (!connection) throw new Error('connection not found')
		return connection
	}
	public getSliders() {
		const list = [
			'https://res.cloudinary.com/de90d6t6e/image/upload/v1717675167/crazyByRasel/Landing%20Page/Slider/l4kkazq4ywjuhavknei0.jpg',
			'https://res.cloudinary.com/de90d6t6e/image/upload/v1717675167/crazyByRasel/Landing%20Page/Slider/xafrvu3b8m4dleyro4ac.jpg',
			'https://res.cloudinary.com/de90d6t6e/image/upload/v1717675167/crazyByRasel/Landing%20Page/Slider/ecqqkqjxrukc5ntpzwev.png',
			'https://res.cloudinary.com/de90d6t6e/image/upload/v1717675167/crazyByRasel/Landing%20Page/Slider/rnkcpxri38m90x2ptpni.jpg',
		]
		return list
	}
}
export default new lendingPageRepo()
