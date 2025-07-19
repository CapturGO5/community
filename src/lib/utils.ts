export function generateDefaultUsername(email: string): string {
  // Get the part before @ in the email
  const emailPrefix = email.split('@')[0];
  
  // Generate a random 5-digit number
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  
  return `${emailPrefix}${randomNum}`;
}
