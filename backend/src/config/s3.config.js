import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION || 'ap-south-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
const bucketName = process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || process.env.AWS_BUCKET_NAME || '';
const customDomain = process.env.AWS_CLOUDFRONT_URL || process.env.AWS_S3_CUSTOM_DOMAIN || '';

/**
 * Checks if S3 is configured.
 * S3 is active if:
 * 1. Bucket name is provided, AND
 * 2. Either explicit IAM credentials exist, or we are running in an AWS IAM Role environment / production.
 */
export const isS3Configured = () => {
  if (!bucketName) return false;
  // If static keys provided
  if (accessKeyId && secretAccessKey) return true;
  // If running on AWS infrastructure with attached IAM Role
  if (process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI || process.env.AWS_EXECUTION_ENV || process.env.AWS_ROLE_ARN) return true;
  // If only bucket name is provided, check if keys or IAM profile are intended
  return Boolean(accessKeyId || process.env.NODE_ENV === 'production');
};

// Build S3 client configuration
const s3ClientConfig = {
  region,
};

// Only pass explicit credentials if both access key and secret key are present
// Otherwise, AWS SDK v3 automatically falls back to AWS IAM Role / Instance Profile / Provider Chain
if (accessKeyId && secretAccessKey) {
  s3ClientConfig.credentials = {
    accessKeyId,
    secretAccessKey,
  };
}

export const s3Client = new S3Client(s3ClientConfig);

export const getBucketName = () => bucketName;

export const getCustomDomain = () => customDomain;

/**
 * Extracts the S3 Object Key from a full S3 or CloudFront URL.
 */
export const getS3KeyFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);
    let pathname = decodeURIComponent(parsed.pathname);
    if (pathname.startsWith('/')) {
      pathname = pathname.substring(1);
    }

    // If bucket name is at start of pathname (path-style URL)
    if (bucketName && pathname.startsWith(`${bucketName}/`)) {
      pathname = pathname.substring(bucketName.length + 1);
    }

    return pathname;
  } catch {
    // If not a full URL, strip leading slash
    return url.startsWith('/') ? url.substring(1) : url;
  }
};

/**
 * Delete an object from S3 by URL or Key
 */
export const deleteS3Object = async (fileUrlOrKey) => {
  if (!isS3Configured()) {
    console.warn('[AWS S3] Delete skipped: S3 is not configured.');
    return false;
  }

  const key = fileUrlOrKey.startsWith('http') ? getS3KeyFromUrl(fileUrlOrKey) : (fileUrlOrKey.startsWith('/') ? fileUrlOrKey.substring(1) : fileUrlOrKey);
  if (!key) return false;

  try {
    const command = new DeleteObjectCommand({
      Bucket: getBucketName(),
      Key: key,
    });
    await s3Client.send(command);
    console.log(`[AWS S3] Successfully deleted object: ${key}`);
    return true;
  } catch (error) {
    console.error(`[AWS S3] Error deleting object ${key}:`, error.message);
    throw error;
  }
};
