import { BlobServiceClient } from "@azure/storage-blob";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { ENVIRONMENT } from "../config/environment";

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Create a BlobServiceClient object
const blobServiceClient = BlobServiceClient.fromConnectionString(
  ENVIRONMENT.STORAGE.AZURE_STORAGE_CONNECTION_STRING,
);
const containerClient = blobServiceClient.getContainerClient(
  ENVIRONMENT.STORAGE.AZURE_CONTAINER_NAME,
);

export const uploadImage = async (
  file: Express.Multer.File,
): Promise<string> => {
  const blobName = `${uuidv4()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(file.buffer, file.size);

  return blockBlobClient.url;
};

export { upload };
