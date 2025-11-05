/**
 * Crypto utilities for encrypting/decrypting sensitive configuration data
 * Uses AES encryption with a fixed key for client-side encryption
 */

import CryptoJS from 'crypto-js';

// Fixed encryption key (stored in code - moderate security)
// For better security, consider using environment variables or user-specific keys
const ENCRYPTION_KEY = 'smart-excalidraw-secret-key-2025';

/**
 * Encrypt a string using AES
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted text
 */
export function encryptText(text) {
  if (!text || typeof text !== 'string') {
    return text;
  }

  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Fallback to plain text if encryption fails
  }
}

/**
 * Decrypt an AES encrypted string
 * @param {string} encryptedText - Encrypted text
 * @returns {string} Decrypted plain text
 */
export function decryptText(encryptedText) {
  if (!encryptedText || typeof encryptedText !== 'string') {
    return encryptedText;
  }

  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const plainText = decrypted.toString(CryptoJS.enc.Utf8);
    return plainText || encryptedText; // Return original if decryption fails
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Fallback to encrypted text
  }
}

/**
 * Encrypt sensitive fields in a configuration object
 * @param {Object} config - Configuration object
 * @returns {Object} Configuration with encrypted sensitive fields
 */
export function encryptConfig(config) {
  if (!config) return config;

  return {
    ...config,
    apiKey: config.apiKey ? encryptText(config.apiKey) : config.apiKey,
    baseUrl: config.baseUrl ? encryptText(config.baseUrl) : config.baseUrl,
  };
}

/**
 * Decrypt sensitive fields in a configuration object
 * @param {Object} config - Configuration object with encrypted fields
 * @returns {Object} Configuration with decrypted sensitive fields
 */
export function decryptConfig(config) {
  if (!config) return config;

  return {
    ...config,
    apiKey: config.apiKey ? decryptText(config.apiKey) : config.apiKey,
    baseUrl: config.baseUrl ? decryptText(config.baseUrl) : config.baseUrl,
  };
}

/**
 * Check if a string is encrypted (basic heuristic check)
 * @param {string} text - Text to check
 * @returns {boolean} True if likely encrypted
 */
export function isEncrypted(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  // Encrypted AES strings from CryptoJS are base64-like and relatively long
  // This is a simple heuristic check
  return text.length > 50 && /^[A-Za-z0-9+/=]+$/.test(text);
}
