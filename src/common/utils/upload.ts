import { BlobServiceClient } from "@azure/storage-blob";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import sharp from "sharp";
import { ENVIRONMENT } from "../config/environment";

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image."));
    }
  },
});

// Create a BlobServiceClient object
const blobServiceClient = BlobServiceClient.fromConnectionString(
  ENVIRONMENT.STORAGE.AZURE_STORAGE_CONNECTION_STRING,
);
const containerClient = blobServiceClient.getContainerClient(
  ENVIRONMENT.STORAGE.AZURE_CONTAINER_NAME,
);

// Function to generate a new file name
const generateFileName = (originalName: string): string => {
  const fileExtension = path.extname(originalName);
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  return `${uniqueId}-${timestamp}${fileExtension}`;
};

// Function to process and upload a single image
export const uploadImage = async (
  file: Express.Multer.File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 80,
): Promise<string> => {
  let buffer = file.buffer;

  // Process the image
  buffer = await sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .webp({ quality }) // Convert to WebP format
    .toBuffer();

  const blobName = generateFileName(file.originalname).replace(
    /\.[^/.]+$/,
    ".webp",
  );
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: "image/webp",
    },
  });

  return blockBlobClient.url;
};

// Function to delete a file
export const deleteFile = async (fileUrl: string): Promise<void> => {
  const blobName = path.basename(fileUrl);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.delete();
};

// Function to upload multiple files
export const uploadMultipleFiles = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  const uploadPromises = files.map((file) => uploadImage(file));
  return Promise.all(uploadPromises);
};

export { upload };
