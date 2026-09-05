/**
 * Application Configuration
 */

export const config = {
  // App Info
  APP_NAME: 'Sign Speak',
  APP_VERSION: '1.0.0',
  
  // API Configuration
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  TIMEOUT: 10000,
  
  // Supabase Configuration
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  
  // Feature Flags
  ENABLE_ANALYTICS: true,
  ENABLE_CRASH_REPORTING: true,
  ENABLE_OFFLINE_MODE: true,
  
  // Language Settings
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: ['en', 'ny'],
  
  // Camera Settings
  CAMERA_QUALITY: 0.8,
  MAX_PHOTO_SIZE: 5242880, // 5MB
  
  // Storage Settings
  MAX_CACHE_SIZE: 52428800, // 50MB
};

export default config;
