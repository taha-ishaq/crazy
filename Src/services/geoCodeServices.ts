import axios from 'axios'
import environments from '../config/environments.js'

const GeocodeService = {
	async autoComplete(input: string, lat: number, lng: number, radius: number) {
		const _host = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${environments.GEOCODE_API_KEY}&location=${lat}%2C${lng}&radius=${radius}&limit=5`
		const response = await axios.get(_host)

		if (response.data['status'] === 'OK') {
			const predictions = response.data['predictions']
			return predictions
		}

		if (response.data['status'] === 'ZERO_RESULTS') {
			return []
		}

		throw new Error(response.data)
	},

	async autocompleteDetails(placeId: string) {
		const _host = 'https://maps.googleapis.com/maps/api/place/details/json'

		const params = {
			place_id: placeId,
			fields: 'geometry,formatted_address,address_components',
			key: environments.GEOCODE_API_KEY,
		}

		const response = await axios.get(_host, { params })

		if (response.data['status'] === 'OK') {
			const results = response.data['result']

			const addressComponents: IAddressComponent[] =
				results['address_components']
			const formatedAddress: string = results['formatted_address']
			const geometryRes: any = results['geometry']
			const coordinates: [number, number] = [
				Number(geometryRes['location']['lng']),
				Number(geometryRes['location']['lat']),
			]

			const address: IAddress = {
				formattedAddress: formatedAddress,
				latitude: coordinates[1],
				longitude: coordinates[0],
				country: addressComponents.filter((e) => e.types.includes('country'))[0]
					.long_name,
				isoCode: addressComponents.filter((e) => e.types.includes('country'))[0]
					.short_name,
				type: 'Point',
				coordinates: coordinates,
				state: addressComponents.filter((e) =>
					e.types.includes('administrative_area_level_1')
				)[0].long_name,
				city: this._cityFromComponents(addressComponents),
			}

			return address
		}
		throw new Error(response.data)
	},

	async direction(from: Ilatlng, to: Ilatlng) {
		const _host = 'https://maps.googleapis.com/maps/api/directions/json?'

		const queryParameters = {
			origin: `${from.latitude},${from.longitude}`,
			destination: `${to.latitude},${to.longitude}`,
			key: environments.GEOCODE_API_KEY,
		}

		const response = await axios.get(_host, { params: queryParameters })

		if (response.data['status'] === 'OK') {
			return response.data as IGeocodeDirection
		}

		if (response.data['status'] === 'NOT_FOUND') {
			throw new Error('Route between points not found')
		}

		throw new Error(response.data)
	},

	async addressFromCoords(latitude: number, longitude: number) {
		const _host = 'https://maps.google.com/maps/api/geocode/json'

		const response = await axios.get(_host, {
			params: {
				key: environments.GEOCODE_API_KEY,
				latlng: `${latitude},${longitude}`,
			},
		})

		if (response.data['status'] === 'OK') {
			const results = response.data['results'][0]

			const addressComponents: IAddressComponent[] =
				results['address_components']

			const formattedAddress = results['formatted_address']

			const geometryRes: any = results['geometry']

			const address: IAddress = {
				formattedAddress,
				latitude: Number(geometryRes['location']['lat']),
				longitude: Number(geometryRes['location']['lng']),
				country: addressComponents.filter((e) => e.types.includes('country'))[0]
					?.long_name,
				isoCode: addressComponents.filter((e) => e.types.includes('country'))[0]
					?.short_name,
				state: addressComponents.filter((e) =>
					e.types.includes('administrative_area_level_1')
				)[0]?.long_name,
				city: this._cityFromComponents(addressComponents),
				type: 'Point',
				coordinates: [
					Number(geometryRes['location']['lng']),
					Number(geometryRes['location']['lat']),
				],
			}

			return address
		}
		throw new Error(response.data)
	},

	_cityFromComponents(components: IAddressComponent[]) {
		const locality = components.filter((e) => e.types.includes('locality'))[0]
			?.long_name

		const administrative_area_level_2 = components.filter((e) =>
			e.types.includes('administrative_area_level_2')
		)[0]?.short_name

		const sublocality_level_1 = components.filter((e) =>
			e.types.includes('sublocality_level_1')
		)[0]?.long_name

		const route = components.filter((e) => e.types.includes('route'))[0]
			?.long_name

		return (
			locality ?? sublocality_level_1 ?? administrative_area_level_2 ?? route
		)
	},
}

export default GeocodeService
