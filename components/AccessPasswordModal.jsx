'use client';

import { useState, useEffect } from 'react';

export default function AccessPasswordModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPassword = localStorage.getItem('smart-excalidraw-access-password') || '';
      const savedUsePassword = localStorage.getItem('smart-excalidraw-use-password') === 'true';
      setPassword(savedPassword);
      setUsePassword(savedUsePassword);
    }
  }, [isOpen]);

  const handleValidate = async () => {
    if (!password) {
      setMessage('请输入访问密码');
      setMessageType('error');
      return;
    }

    setIsValidating(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.valid) {
        setMessage('密码验证成功');
        setMessageType('success');
      } else {
        setMessage(data.message || '密码验证失败');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('验证请求失败');
      setMessageType('error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smart-excalidraw-access-password', password);
      localStorage.setItem('smart-excalidraw-use-password', usePassword.toString());

      // Dispatch custom event to notify other components in the same tab
      window.dispatchEvent(new CustomEvent('password-settings-changed', {
        detail: { usePassword }
      }));
    }
    setMessage('设置已保存');
    setMessageType('success');
    setTimeout(() => {
      onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded border border-gray-300 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">访问密码设置</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {message && (
            <div className={`px-4 py-3 border rounded ${
              messageType === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-sm ${
                messageType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>{message}</p>
            </div>
          )}

          <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800 font-medium mb-1">提示：</p>
            <p className="text-sm text-blue-800">• 访问密码优先级高于前端LLM配置</p>
            <p className="text-sm text-blue-800">• 启用后将使用服务器端配置的LLM</p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              访问密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入访问密码"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* Enable Password & Validate */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">启用访问密码</span>
            </label>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 transition-colors duration-200 font-medium"
            >
              {isValidating ? '验证中...' : '验证密码'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
