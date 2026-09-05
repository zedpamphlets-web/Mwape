/**
 * Text cleanup utilities for sign language transcription
 */

export const cleanTranscription = (text) => {
  if (!text) return '';
  
  // Remove extra whitespace
  let cleaned = text.trim().replace(/\s+/g, ' ');
  
  // Remove punctuation marks that don't belong
  cleaned = cleaned.replace(/[^\w\s\-]/g, '');
  
  return cleaned;
};

export const normalizeText = (text) => {
  if (!text) return '';
  
  // Convert to lowercase for consistency
  let normalized = text.toLowerCase();
  
  // Remove special characters but keep spaces and hyphens
  normalized = normalized.replace(/[^a-z0-9\s\-]/g, '');
  
  return normalized;
};

export const removeDuplicates = (text) => {
  if (!text) return '';
  
  // Split into words and remove duplicates
  const words = text.split(' ');
  const unique = [...new Set(words)];
  
  return unique.join(' ');
};

export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};
