import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseMetadata(description: string) {
  if (!description) return { text: "", metadata: {} };
  
  try {
    const parsed = JSON.parse(description);
    if (parsed && typeof parsed === 'object') {
      // It's a JSON object (could be flat or have a .metadata nested property)
      const metadata = parsed.metadata || { ...parsed };
      
      // Remove text and shortDescription from metadata if they are top-level
      if (!parsed.metadata) {
        delete metadata.text;
        delete metadata.shortDescription;
      }

      return {
        text: parsed.text || metadata.description || description,
        metadata: {
          shortDescription: parsed.shortDescription || "",
          dimensions: metadata.dimensions || "",
          print: metadata.print || "",
          paper: metadata.paper || "",
          delivery: metadata.delivery || "",
          image: metadata.image || "",
          color: metadata.color || "",
          ...metadata
        }
      };
    }
  } catch (e) {
    // Not JSON
  }
  return {
    text: description,
    metadata: {}
  };
}
