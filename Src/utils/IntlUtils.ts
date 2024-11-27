const IntlUtil = {
	formatDate: (date: Date) => {
		const day = date.getDate()
		const month = date.getMonth() + 1
		const year = date.getFullYear()
		return `${day}/${month}/${year}`
	},

	getTimeElapsed: (days: number): string => {
		return days === 0
			? 'today'
			: days >= 30
			? `${Math.floor(days / 30)} month${days >= 60 ? 's ago' : ' ago'}`
			: days >= 7
			? `${Math.floor(days / 7)} week${days >= 14 ? 's ago' : ' ago'}`
			: `${days} day${days !== 1 ? 's ago' : ' ago'}`
	},
	selectFolderByCategory: (category: string) => {
		switch (category) {
			case 'Tech & Electronics':
				return 'Products/TechAndElectronics'
			case 'Fashion':
				return 'Products/Fashion'
			case 'Sports':
				return 'Products/Sports'
			case 'Travel':
				return 'Products/Travel'
			case 'Music':
				return 'Products/Music'
			case 'Books':
				return 'Products/Books'
			case 'Beauty':
				return 'Products/Beauty'
			case 'Jewlery':
				return 'Products/Jewlery'
			case 'Home Decor':
				return 'Products/Home-Decor'
			case 'Grocery':
				return 'Products/Grocery'
			case 'Baby':
				return 'Products/Baby'
			case 'Beverages':
				return 'Products/Beverages'
			case 'Ice Cream':
				return 'Products/IceCream'
			case 'Personal Care':
				return 'Products/'
			case 'Snacks':
				return 'Products/Snacks'
			case 'Alcohol':
				return
			case 'Smoke Essentials':
				return 'Products/SmokeEssentials'
			case 'Pet Food':
				return 'Products/PetFood'
			case 'Pharmacy':
				return 'Product/Pharmacy'
			default:
				return 'Products/Unknown'
		}
	},

	shuffleArray: (array: any) => {
		// it will randomize the array
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	},
}
export default IntlUtil
