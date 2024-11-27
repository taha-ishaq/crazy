import express from 'express'
import GeocodeController from '../Functions/geoCodeController.js'
const geoCodeRoute = express.Router()
geoCodeRoute.get('/direction', GeocodeController.direction)
geoCodeRoute.get('/address-from-coords', GeocodeController.addressFromCoords)
geoCodeRoute.get('/autoComplete', GeocodeController.autoCompleteAddress)
geoCodeRoute.get(
	'/autoCompleteAddressDetails',
	GeocodeController.AutoCompleteAddressDetails
)

export default geoCodeRoute
