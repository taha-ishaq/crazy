const formatDate = (inputDate: Date) => {
	// Create a new Date object from the input string
	const date = new Date(inputDate)

	// Extract year, month, and day components
	const year = date.getFullYear()
	const month = ('0' + (date.getMonth() + 1)).slice(-2) // Month is zero-indexed, so add 1, and ensure it's always two digits
	const day = ('0' + date.getDate()).slice(-2) // Ensure day is always two digits

	// Construct the formatted date string
	const formattedDate = `${year}-${month}-${day}`

	return formattedDate
}

export default formatDate
