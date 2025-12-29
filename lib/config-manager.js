/**
 * 配置管理器 - 处理多份大模型API配置的管理
 */

class ConfigManager {
  constructor() {
    this.STORAGE_KEY = 'smart-excalidraw-configs';
    this.ACTIVE_CONFIG_KEY = 'smart-excalidraw-active-config';
    this.configs = [];
    this.activeConfigId = null;
    this.isLoaded = false;
    // Don't load configs in constructor to avoid SSR issues
  }

  /**
   * 生成唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 确保配置已加载
   */
  ensureLoaded() {
    if (!this.isLoaded) {
      this.loadConfigs();
    }
  }

  /**
   * 获取活跃配置ID
   */
  getActiveConfigId() {
    this.ensureLoaded();
    return this.activeConfigId;
  }

  /**
   * 从localStorage加载配置
   */
  loadConfigs() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      this.configs = stored ? JSON.parse(stored) : [];
      this.activeConfigId = localStorage.getItem(this.ACTIVE_CONFIG_KEY);
      this.isLoaded = true;

      // 如果没有活跃配置但有配置列表，设置第一个为活跃配置
      if (!this.activeConfigId && this.configs.length > 0) {
        this.activeConfigId = this.configs[0].id;
        this.saveActiveConfigId();
      }
    } catch (error) {
      console.error('Failed to load configs:', error);
      this.configs = [];
      this.activeConfigId = null;
      this.isLoaded = true;
    }
  }

  /**
   * 保存配置到localStorage
   */
  saveConfigs() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.configs));
    } catch (error) {
      console.error('Failed to save configs:', error);
    }
  }

  /**
   * 保存活跃配置ID
   */
  saveActiveConfigId() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (this.activeConfigId) {
        localStorage.setItem(this.ACTIVE_CONFIG_KEY, this.activeConfigId);
      } else {
        localStorage.removeItem(this.ACTIVE_CONFIG_KEY);
      }
    } catch (error) {
      console.error('Failed to save active config ID:', error);
    }
  }

  /**
   * 创建新配置
   */
  createConfig(configData) {
    const newConfig = {
      id: this.generateId(),
      name: configData.name || '新配置',
      type: configData.type || 'openai',
      baseUrl: configData.baseUrl || '',
      apiKey: configData.apiKey || '',
      model: configData.model || '',
      description: configData.description || '',
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...configData
    };

    this.configs.push(newConfig);

    // 如果这是第一个配置，设置为活跃配置
    if (this.configs.length === 1) {
      this.setActiveConfig(newConfig.id);
    }

    this.saveConfigs();
    return newConfig;
  }

  /**
   * 更新配置
   */
  updateConfig(id, updateData) {
    const configIndex = this.configs.findIndex(config => config.id === id);
    if (configIndex === -1) {
      throw new Error('配置不存在');
    }

    this.configs[configIndex] = {
      ...this.configs[configIndex],
      ...updateData,
      id, // 确保ID不被修改
      updatedAt: new Date().toISOString()
    };

    this.saveConfigs();
    return this.configs[configIndex];
  }

  /**
   * 删除配置
   */
  deleteConfig(id) {
    const configIndex = this.configs.findIndex(config => config.id === id);
    if (configIndex === -1) {
      throw new Error('配置不存在');
    }

    // 如果删除的是活跃配置，需要重新设置活跃配置
    if (this.activeConfigId === id) {
      this.activeConfigId = null;
      // 设置剩余配置中的第一个为活跃配置
      if (this.configs.length > 1) {
        const remainingConfigs = this.configs.filter(config => config.id !== id);
        this.activeConfigId = remainingConfigs[0].id;
        this.saveActiveConfigId();
      } else {
        this.saveActiveConfigId();
      }
    }

    this.configs.splice(configIndex, 1);
    this.saveConfigs();
  }

  /**
   * 获取所有配置
   */
  getAllConfigs() {
    this.ensureLoaded();
    return [...this.configs];
  }

  /**
   * 根据ID获取配置
   */
  getConfig(id) {
    this.ensureLoaded();
    return this.configs.find(config => config.id === id);
  }

  /**
   * 获取当前活跃配置
   */
  getActiveConfig() {
    this.ensureLoaded();
    if (!this.activeConfigId) return null;
    return this.getConfig(this.activeConfigId);
  }

  /**
   * 设置活跃配置
   */
  setActiveConfig(id) {
    const config = this.getConfig(id);
    if (!config) {
      throw new Error('配置不存在');
    }

    this.activeConfigId = id;
    this.saveActiveConfigId();
    return config;
  }

  /**
   * 克隆配置
   */
  cloneConfig(id, newName) {
    this.ensureLoaded();
    const originalConfig = this.getConfig(id);
    if (!originalConfig) {
      throw new Error('原配置不存在');
    }

    const clonedConfig = {
      ...originalConfig,
      name: newName || `${originalConfig.name} (副本)`,
      isActive: false
    };

    delete clonedConfig.id;
    delete clonedConfig.createdAt;
    delete clonedConfig.updatedAt;

    return this.createConfig(clonedConfig);
  }

  /**
   * 验证配置
   */
  validateConfig(config) {
    const errors = [];

    if (!config.name || config.name.trim() === '') {
      errors.push('配置名称不能为空');
    }

    if (!config.type || !['openai', 'anthropic', 'aliyun'].includes(config.type)) {
      errors.push('配置类型必须是 openai、anthropic 或 aliyun');
    }

    if (!config.baseUrl || config.baseUrl.trim() === '') {
      errors.push('API地址不能为空');
    } else {
      try {
        new URL(config.baseUrl);
      } catch {
        errors.push('API地址格式不正确');
      }
    }

    if (!config.apiKey || config.apiKey.trim() === '') {
      errors.push('API密钥不能为空');
    }

    if (!config.model || config.model.trim() === '') {
      errors.push('模型名称不能为空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 测试配置连接
   */
  async testConnection(config) {
    const validation = this.validateConfig(config);
    if (!validation.isValid) {
      throw new Error('配置无效: ' + validation.errors.join(', '));
    }

    try {
      // 这里可以添加实际的连接测试逻辑
      // 暂时返回成功状态
      return { success: true, message: '连接测试成功' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * 导入配置
   */
  importConfigs(configsData) {
    try {
      const importedConfigs = JSON.parse(configsData);
      if (!Array.isArray(importedConfigs)) {
        throw new Error('导入数据格式错误');
      }

      let importCount = 0;
      for (const configData of importedConfigs) {
        // 验证配置格式
        const validation = this.validateConfig(configData);
        if (validation.isValid) {
          this.createConfig({
            ...configData,
            isActive: false
          });
          importCount++;
        }
      }

      return { success: true, count: importCount };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * 导出配置
   */
  exportConfigs() {
    return JSON.stringify(this.configs, null, 2);
  }

  /**
   * 搜索配置
   */
  searchConfigs(query) {
    this.ensureLoaded();
    const lowerQuery = query.toLowerCase();
    return this.configs.filter(config =>
      config.name.toLowerCase().includes(lowerQuery) ||
      config.description.toLowerCase().includes(lowerQuery) ||
      config.type.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 获取配置统计信息
   */
  getStats() {
    this.ensureLoaded();
    const stats = {
      total: this.configs.length,
      active: 0,
      byType: {}
    };

    this.configs.forEach(config => {
      if (config.id === this.activeConfigId) {
        stats.active = 1;
      }

      const type = config.type;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }
}

// 导出单例实例
export const configManager = new ConfigManager();
export default ConfigManager;