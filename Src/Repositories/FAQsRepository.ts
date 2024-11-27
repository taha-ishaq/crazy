import { ObjectId } from 'mongoose'
import FAQ from '../Model/FAQModel.js'
import { IFAQsModel } from '../Model/interface/IFAQs.js'

class FAQsRepository {
	public async create(data: IFAQsModel.IFAQ) {
		if (!data) throw new Error('Invalid data provided')
		const faq = await FAQ.create(data)
		return faq
	}
	public async getAll() {
		const faqs = await FAQ.find().lean()
		if (faqs.length <= 0) throw new Error('No FAQs found')
		return faqs
	}
	public async getById(id: string | ObjectId) {
		const faq = await FAQ.findById(id).lean()
		if (!faq) throw new Error('No FAQ found')
		return faq
	}
	public async update(data: IFAQsModel.IFAQUpdate) {
		if (!data) throw new Error('Invalid data provided')
		const faq = await FAQ.findByIdAndUpdate(
			data.faqId,
			{ question: data.question, answer: data.answer },
			{ new: true }
		).lean()
		if (!faq) throw new Error('No FAQ found')
		return faq
	}
	public async delete(id: string | ObjectId) {
		const faq = await FAQ.findByIdAndDelete(id).lean()
		if (!faq) throw new Error('No FAQ found')
		return 'FAQ deleted successfully'
	}
}
export default new FAQsRepository()
