// export async function ImageService(file: Express.Multer.File) {
// 	const _imagekit = new ImageKit({
// 		publicKey: environments.IMAGE_KIT_PUB_KEY,
// 		privateKey: environments.IMAGE_KIT_PRV_KEY,
// 		urlEndpoint: environments.IMAGE_KIT_URL_ENDPOINT,
// 	})

// 	return await _imagekit.upload({
// 		file: file.buffer,
// 		fileName: file.originalname,
// 	})
// }

import fs from 'fs'
import ImageKit from 'imagekit'
import environments from '../config/environments.js'

export class ImageService {
	private _imagekit: ImageKit

	constructor() {
		this._imagekit = new ImageKit({
			publicKey: environments.IMAGE_KIT_PUB_KEY,
			privateKey: environments.IMAGE_KIT_PRV_KEY,
			urlEndpoint: environments.IMAGE_KIT_URL_ENDPOINT,
		})
	}

	async upload(fileInfo: Express.Multer.File, tags: string[]) {
		const { originalname, path } = fileInfo

		// Read the file content as a buffer
		const fileBuffer = fs.readFileSync(path)

		try {
			const response = await this._imagekit.upload({
				file: fileBuffer,
				fileName: originalname,
				tags: tags.join(','), // Concatenate tags into a single string separated by commas
				useUniqueFileName: false, // Set to true if you want to generate a unique filename
			})

			// Returns the URL of the uploaded image
			return response.url
		} catch (error) {
			console.error('Error uploading image:', error)
			throw error
		}
	}
}
