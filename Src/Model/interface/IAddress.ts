interface IAddress {
	formattedAddress: string
	latitude: number
	longitude: number
	country: string
	isoCode: string
	state: string
	city: string
	type: 'Point'
	coordinates: [number, number]
}
interface IAddressComponent {
	long_name: string
	short_name: string
	types: string[]
}
interface Ilatlng {
	latitude: number
	longitude: number
}
interface ILatLngBounds {
	northeast: {
		lat: number
		lng: number
	}
	southwest: {
		lat: number
		lng: number
	}
}
interface IGeocodeDirection {
	routes: [
		{
			bounds: ILatLngBounds
			copyrights: string
			legs: [
				{
					distance: {
						text: string
						value: number
					}
					duration: {
						text: string
						value: number
					}
					end_address: string
					end_location: {
						lat: number
						lng: number
					}
					start_address: string
					start_location: {
						lat: number
						lng: number
					}
					traffic_speed_entry: []
					via_waypoint: []
				}
			]
			overview_polyline: { points: string }
			summary: string
			warnings: []
			waypoint_order: []
		}
	]
	status: 'OK'
}
