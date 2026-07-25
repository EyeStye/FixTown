import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinaryPkg from 'cloudinary'

const { v2: cloudinary } = cloudinaryPkg

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'fixtown/issues',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 900, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
})

export { cloudinary }