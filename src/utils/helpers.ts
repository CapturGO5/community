export function encodeId(str: string): string {
  return encodeURIComponent(str)
    .replace(/[^a-zA-Z0-9]/g, '-')
    .toLowerCase();
}

export function decodeId(encodedId: string): string {
  return decodeURIComponent(encodedId.replace(/-/g, '%20'));
}

export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const extension = originalFilename.split('.').pop() || '';
  const encodedName = encodeId(originalFilename.split('.')[0]);
  return `${timestamp}-${encodedName}.${extension}`;
}
