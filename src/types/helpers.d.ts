/**
 * Encodes a string to be URL and filename safe
 */
export declare function encodeId(str: string): string;

/**
 * Decodes a previously encoded string
 */
export declare function decodeId(encodedId: string): string;

/**
 * Generates a unique filename for storage uploads
 * Includes timestamp and encoded original filename
 */
export declare function generateUniqueFilename(originalFilename: string): string;
