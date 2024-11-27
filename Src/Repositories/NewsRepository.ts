import NewsModel from '../Model/NewsModel.js'
import { INewsModel } from '../Model/interface/INews.js'

class newsRepository {
	public async createNews(data: INewsModel.INews) {
		if (!data.title || !data.business) throw new Error('Invalid data provided')
		const news = await NewsModel.create(data)
		return news
	}
	public async getNews() {
		const news = await NewsModel.find().lean()
		if (news.length <= 0) throw new Error('No news found')
		return news
	}
}
export default new newsRepository()
