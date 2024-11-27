import * as dotenv from 'dotenv'
dotenv.config()

const environments = {
	Mail: process.env.Mail ?? '',
	MailPass: process.env.MailPass ?? '',
	JWT_SECRET: process.env.JWT_SECRET ?? '',
	JWT_EXPIRESIN: process.env.JWT_EXPIRESIN ?? '',
	CloudName: process.env.CloudName ?? '',
	CloudApiKey: process.env.CloudApiKey ?? '',
	CloudApiSecret: process.env.CloudApiSecret ?? '',
	IMAGE_KIT_PUB_KEY: process.env.IMAGE_KIT_PUB_KEY ?? '',
	IMAGE_KIT_PRV_KEY: process.env.IMAGE_KIT_PRV_KEY ?? '',
	IMAGE_KIT_URL_ENDPOINT: process.env.IMAGE_KIT_URL_ENDPOINT ?? '',
	discordWebHook: process.env.DISCORD_WEB_HOOK ?? '',
	APPLICATION_STATUS: process.env.APPLICATION_STATUS ?? 'dev',
	mongoURL: process.env.mongoURL ?? '',
	GEOCODE_API_KEY: process.env.GEOCODE_API_KEY ?? '',
	SQUARE_ACCESS_TOKEN: process.env.SQUARE_ACCESS_TOKEN ?? '',
	DELIVERY_FEE_IN_USD: process.env.DELIVERY_FEE_IN_USD ?? 1,
	PLATFORM_FEE_IN_USD: process.env.PLATFORM_FEE_IN_USD ?? 0.5,
	CareerMail: process.env.CareerMail ?? '',
	CareerMailPass: process.env.CareerMailPass ?? '',
	NoReplyMail: process.env.NoReplyMail ?? '',
	NoReplyMailPass: process.env.NoReplyMailPass ?? '',
	SQUARE_LOCATION_ID: process.env.SQUARE_LOCATION_ID ?? '',
}

export default environments
