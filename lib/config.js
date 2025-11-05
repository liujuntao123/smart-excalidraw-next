/**
 * Configuration management for LLM providers
 * Backward compatibility layer for the new multi-config system
 */

import { configManager } from './config-manager.js';

const LEGACY_CONFIG_KEY = 'smart-excalidraw-config';

function getEnvValue(keys) {
  if (typeof process === 'undefined' || !process?.env) return undefined;

  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string') {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        return trimmedValue;
      }
    } else if (value) {
      return value;
    }
  }

  return undefined;
}

export function getEnvConfig() {
  const type = getEnvValue(['NEXT_PUBLIC_LLM_TYPE', 'LLM_TYPE']);
  const baseUrl = getEnvValue(['NEXT_PUBLIC_LLM_BASE_URL', 'LLM_BASE_URL']);
  const apiKey = getEnvValue(['NEXT_PUBLIC_LLM_API_KEY', 'LLM_API_KEY']);
  const model = getEnvValue(['NEXT_PUBLIC_LLM_MODEL', 'LLM_MODEL']);

  if (type && baseUrl && apiKey && model) {
    return {
      name: '环境变量配置',
      type,
      baseUrl,
      apiKey,
      model
    };
  }

  return null;
}

/**
 * Migration: Check if there's an old single config and migrate it
 */
function migrateLegacyConfig() {
  if (typeof window === 'undefined') return;

  try {
    const legacyConfig = localStorage.getItem(LEGACY_CONFIG_KEY);
    if (legacyConfig && configManager.getAllConfigs().length === 0) {
      // Found legacy config and no new configs, migrate it
      const config = JSON.parse(legacyConfig);
      configManager.createConfig({
        name: config.name || '迁移的配置',
        type: config.type,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model,
        description: '从旧版本迁移的配置'
      });

      // Clear the old config after migration
      localStorage.removeItem(LEGACY_CONFIG_KEY);
    }
  } catch (error) {
    console.error('Failed to migrate legacy config:', error);
  }
}

/**
 * Get the current provider configuration (backward compatibility)
 * @returns {Object|null} Provider configuration or null if not set
 */
export function getConfig() {
  const envConfig = getEnvConfig();
  if (envConfig) {
    return envConfig;
  }

  if (typeof window === 'undefined') return null;

  // Ensure legacy config is migrated
  migrateLegacyConfig();

  // Return the active config from the new manager
  const activeConfig = configManager.getActiveConfig();
  if (!activeConfig) return null;

  // Return only the fields expected by legacy code
  return {
    name: activeConfig.name,
    type: activeConfig.type,
    baseUrl: activeConfig.baseUrl,
    apiKey: activeConfig.apiKey,
    model: activeConfig.model
  };
}

/**
 * Save provider configuration (backward compatibility)
 * @param {Object} config - Provider configuration
 * @param {string} config.name - Provider display name
 * @param {string} config.type - Provider type ('openai' or 'anthropic')
 * @param {string} config.baseUrl - API base URL
 * @param {string} config.apiKey - API key
 * @param {string} config.model - Selected model
 */
export function saveConfig(config) {
  if (typeof window === 'undefined') return;

  // Ensure legacy config is migrated
  migrateLegacyConfig();

  try {
    const activeConfig = configManager.getActiveConfig();
    if (activeConfig) {
      // Update existing active config
      configManager.updateConfig(activeConfig.id, config);
    } else {
      // Create new config and set as active
      const newConfig = configManager.createConfig(config);
      configManager.setActiveConfig(newConfig.id);
    }
  } catch (error) {
    console.error('Failed to save config:', error);
    throw error;
  }
}

/**
 * Check if configuration is valid and complete
 * @param {Object} config - Configuration to validate
 * @returns {boolean} True if configuration is valid
 */
export function isConfigValid(config) {
  if (!config) return false;

  return !!(
    config.type &&
    config.baseUrl &&
    config.apiKey &&
    config.model
  );
}

// Export the config manager for direct access in new components
export { configManager };

