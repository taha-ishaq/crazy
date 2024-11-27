import ContactUsRequestModel from '../Model/ContactUsRequestModel.js'
import { IContactUsModel } from '../Model/interface/IContactRequests.js'

class GuestRepository {
	public async contactUsRequestCreate(data: IContactUsModel.IContactCreate) {
		if (!data) throw new Error('invalid data')
		const contact = await ContactUsRequestModel.create({ ...data })
		return contact
	}
	public async getAllContacts() {
		const contacts = await ContactUsRequestModel.find().lean()
		return contacts
	}
}
export default new GuestRepository()
