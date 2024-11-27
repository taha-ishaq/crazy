export declare module ISubscriberModel {
	interface ISubscribe extends Document {
		email: string
		name: string
		subscriptions: string
	}

	interface ISubscriber {
		email: string
		name: string
		subscriptions: string
	}
}
