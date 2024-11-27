import express from 'express'
import FAQsController from '../Functions/FAQsController.js'

const FAQsRoutes = express.Router()

FAQsRoutes.get('/:id', FAQsController.get)
FAQsRoutes.post('/', FAQsController.create)
FAQsRoutes.patch('/:id', FAQsController.update)
FAQsRoutes.delete('/:id', FAQsController.delete)
FAQsRoutes.get('/', FAQsController.getAll)
export default FAQsRoutes
