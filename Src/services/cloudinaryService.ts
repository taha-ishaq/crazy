import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import environments from '../config/environments.js'

cloudinary.config({
	cloud_name: environments.CloudName,
	api_key: environments.CloudApiKey,
	api_secret: environments.CloudApiSecret,
})

const upload = multer({
	storage: multer.diskStorage({}),
})

export async function uploadToCloudinary(file: string, folderName: string) {
	try {
		if (!file) {
			throw Error('No file provided for upload')
		}
		const result = await cloudinary.uploader.upload(file, {
			folder: folderName,
		})
		return result.secure_url
	} catch (error) {
		throw Error('Error Uploading file to cloudinary' + error)
	}
}

export function singleFileUploadMiddleware(fieldName: string) {
	return upload.single(fieldName)
}

export function multipleFileUploadMiddleware(fieldName: string, num: number) {
	return upload.array(fieldName, num)
}

export function multipleFileWithMultipleFieldsUploadMiddleware(
	fieldsObject: any
) {
	return upload.fields(fieldsObject)
}
