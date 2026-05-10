import { countries } from "./countries";

export function calculateDeliveryDays(countryCode: string): number {
  const country = countries.find((c) => c.code === countryCode);
  
  if (!country) return 30; // Default to international if not found

  switch (country.zone) {
    case "local":
      return 6;
    case "surrounding":
      return 11;
    case "farther":
      return 16;
    case "international":
      return 30;
    default:
      return 30;
  }
}

export function getEstimatedDeliveryDate(countryCode: string): string {
  const days = calculateDeliveryDays(countryCode);
  const date = new Date();
  
  // Basic calculation: current date + business days
  // To be more accurate, we could skip weekends, but the user asked for "6 business days" 
  // and showing it as a range or a fixed number is common.
  // Let's just return the number of days as text for now, 
  // or calculate the actual date if they want a date string.
  // The user said "6busness day for local country", so let's provide a function that returns the string.
  
  return `${days} business days`;
}
