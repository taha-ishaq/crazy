import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import DBConnect from './config/connection.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(
	express.urlencoded({
		extended: true,
	})
)

// testing route
app.get('/', (_, res) => {
	res.send('Hello Server is running on the port 2500')
})

// Import routes

import axios from 'axios'
import environments from './config/environments.js'
import adminRoute from './routes/adminRoute.js'
import authRoute from './routes/authRoute.js'
import buyerRoute from './routes/buyerRoute.js'
import geoCodesRoute from './routes/geoCodesRoute.js'

import FAQsRoutes from './routes/FAQsRoutes.js'
import LendingPageRoute from './routes/LendingPageRoutes.js'
import productsRoute from './routes/ProductsRout.js'
import careersRoute from './routes/careersRoute.js'
import cartRoute from './routes/cartRoutes.js'
import guestRoute from './routes/guestRoute.js'
import locationRoute from './routes/locationRoute.js'
import loyaltyProgramRoute from './routes/loyaltyProgramRoutes.js'
import tempRoute from './routes/tempRoute.js'
import walletRoutes from './routes/walletRoute.js'

// Custom middleware
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/admin', adminRoute)
app.use('/api/v1/buyer', buyerRoute)
app.use('/api/v1/careers', careersRoute)
app.use('/api/v1/geocodes', geoCodesRoute)
app.use('/api/v1/wallet', walletRoutes)
app.use('/api/v1/lendingpage', LendingPageRoute)
app.use('/api/v1/faqs', FAQsRoutes)
app.use('/api/v1/guest', guestRoute)
app.use('/api/v1/product', productsRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/locations', locationRoute)
app.use('/api/v1/loyalty', loyaltyProgramRoute)
app.use('/temp', tempRoute)

const port = process.env.PORT || 2700

DBConnect().then(() => {
	app.listen(port, async () => {
		console.log(`Server is running on the port ${port}`)
		if (environments.APPLICATION_STATUS == 'prod') {
			await axios.post(environments.discordWebHook, {
				content: '🚀 Crazy By Rasel Server Online 🚀',
			})
		}
	})
})
