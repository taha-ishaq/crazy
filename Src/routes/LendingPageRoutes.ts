import express from 'express'
import lendingPageController from '../Functions/LandingPageController.js'
import newsController from '../Functions/NewsController.js'
import businessController from '../Functions/businessController.js'
import reviewController from '../Functions/reviewController.js'
const LendingPageRoute = express.Router()
LendingPageRoute.post('/', lendingPageController.addConnection)
LendingPageRoute.get('/business', businessController.getBusinesses)
LendingPageRoute.get('/news', newsController.getNews)
LendingPageRoute.get('/reviews', reviewController.getAllReviews)
LendingPageRoute.get('/sliders', lendingPageController.getSliders)

export default LendingPageRoute
