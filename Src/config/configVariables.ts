import environments from './environments.js'

const adminEmails = () => {
	if (environments.APPLICATION_STATUS === 'dev') {
		return [
			// 'rasel@therasel.com',
			// 'rafay@therasel.com',
			'muhamadkhuram207@gmail.com',
			// 'ranaalihaider9696@gmail.com',
			'jkb634915@gmail.com',
		]
	}
	return [
		'rasel@therasel.com',
		'rafay@therasel.com',
		'muhamadkhuram207@gmail.com',
		'ranaalihaider9696@gmail.com',
	]
}

const ConfigVars = {
	adminEmails,
	alreadySubscribed:
		'https://res.cloudinary.com/de90d6t6e/image/upload/v1716463749/crazyByRasel/empty%20screens/js8mjdxce0o4at9okqef.png',
}

export default ConfigVars
