export declare module IFAQsModel {
	interface IFAQ {
		// admin: ObjectId
		question: string
		answer: string
	}
	interface IFAQUpdate {
		faqId: string
		question: string
		answer: string
	}
}
