declare namespace Express {
	export interface Request {
		user:
			| (import('mongoose').FlattenMaps<
					import('../Model/interface/IUser').IUserModule.IUserObject
			  > & { _id: import('mongoose').ObjectId })
			| any

		admin: any

		language?: string

		coordinates?: [number, number]
	}
}
