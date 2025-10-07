import supabase from './supabase';
import { v4 as uuidv4 } from 'uuid';

// File types for organization
type FileType = 'pitchDeck' | 'demoVideo' | 'logo' | 'productImage' | 'founderPhoto' | 'teamPhoto' | 'businessPlan' | 'financialProjections' | 'legalDocuments';

// Result interface for file uploads
interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// The single bucket name for all uploads
const BUCKET_NAME = 'plantify-uploads';

/**
 * Upload a single file to Supabase Storage
 * @param file The file to upload
 * @param fileType Type of file for organizing in storage buckets
 * @returns UploadResult with success status and URL or error
 */
export const uploadFile = async (
  file: File, 
  bucket: string = BUCKET_NAME,
  fileType: string = 'general'
): Promise<string | null> => {
  try {
    console.log(`Starting upload for file: ${file.name}`);
    
    // Generate a unique filename to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create path based on file type
    const filePath = `${fileType}/${fileName}`;
    
    console.log(`Uploading file to path: ${filePath}`);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
      
    if (error) {
      console.error('Supabase storage error:', error);
      return null;
    }
    
    console.log(`File uploaded successfully, getting public URL`);
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
      
    console.log(`Public URL: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};

/**
 * Upload multiple files to Supabase Storage
 * @param files Array of files to upload
 * @param fileType Type of files for organizing in storage buckets
 * @returns Array of URLs for the uploaded files
 */
export const uploadMultipleFiles = async (
  files: File[], 
  bucket: string = BUCKET_NAME,
  fileType: string = 'general'
): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadFile(file, bucket, fileType));
  const results = await Promise.all(uploadPromises);
  
  // Filter out any failed uploads (null values)
  return results.filter(url => url !== null) as string[];
};

/**
 * Download a file from Supabase Storage
 * @param url The public URL of the file to download
 * @returns void - Triggers browser download
 */
export const downloadFile = async (url: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketName = BUCKET_NAME;
    
    // Get the file path after the bucket name
    const bucketIndex = pathParts.findIndex(part => part === bucketName);
    if (bucketIndex === -1) {
      throw new Error('Invalid file URL format');
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    // Get file metadata to determine filename
    const { data: fileData, error: fileError } = await supabase.storage
      .from(bucketName)
      .download(filePath);
      
    if (fileError) {
      console.error('Error downloading file:', fileError);
      throw new Error(`Failed to download file: ${fileError.message}`);
    }
    
    // Create a download link and trigger download
    const downloadUrl = URL.createObjectURL(fileData);
    const fileName = pathParts[pathParts.length - 1];
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the object URL
    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 100);
    
  } catch (error) {
    console.error('File download error:', error);
    throw error;
  }
};

/**
 * Get a signed URL for a file (useful for temporary access or for files not publicly accessible)
 * @param url The public URL of the file
 * @param expiresIn Expiration time in seconds (default: 60 seconds)
 * @returns Promise with the signed URL
 */
export const getSignedUrl = async (url: string, expiresIn = 60): Promise<string> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucketName = BUCKET_NAME;
    
    // Get the file path after the bucket name
    const bucketIndex = pathParts.findIndex(part => part === bucketName);
    if (bucketIndex === -1) {
      throw new Error('Invalid file URL format');
    }
    
    const filePath = pathParts.slice(bucketIndex + 1).join('/');
    
    // Get signed URL
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, expiresIn);
      
    if (error) {
      console.error('Error creating signed URL:', error);
      throw new Error(`Failed to create signed URL: ${error.message}`);
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Signed URL error:', error);
    throw error;
  }
};
