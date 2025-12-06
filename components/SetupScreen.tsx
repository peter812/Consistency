import React, { useState } from 'react';
import { UserConfig } from '../types';
import { saveUserConfig } from '../services/storage';
import { Button } from './Button';
import { Settings, Check, RefreshCw } from 'lucide-react';

interface SetupScreenProps {
  onComplete: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [apiEnabled, setApiEnabled] = useState(false);
  const [generatedKey, setGeneratedKey] = useState('');
  const [error, setError] = useState('');

  const generateApiKey = () => {
    const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `Con-${randomPart}`;
  };

  const handleApiToggle = () => {
    const newState = !apiEnabled;
    setApiEnabled(newState);
    if (newState && !generatedKey) {
      setGeneratedKey(generateApiKey());
    } else if (!newState) {
      setGeneratedKey('');
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Name is required');
    if (pin.length < 4) return setError('PIN must be at least 4 digits');
    if (pin !== confirmPin) return setError('PINs do not match');

    const config: UserConfig = {
      name,
      pin,
      apiEnabled,
      apiKey: generatedKey,
      isSetupComplete: true,
    };

    saveUserConfig(config);
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-4">
      <div className="max-w-md w-full bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 bg-blue-600 rounded-full">
            <Settings className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-white mb-2">Setup Mode</h1>
        <p className="text-gray-400 text-center mb-8">Configure your Consistency App</p>

        <form onSubmit={handleFinish} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Create PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="****"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Confirm PIN</label>
              <input
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="****"
              />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Enable API Access</span>
              <button
                type="button"
                onClick={handleApiToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                  apiEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`${
                    apiEnabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            {apiEnabled && (
              <div className="relative">
                <label className="block text-xs font-medium text-gray-400 mb-1">Your API Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedKey}
                    className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm font-mono text-green-400"
                  />
                  <button
                    type="button"
                    onClick={() => setGeneratedKey(generateApiKey())}
                    className="p-2 bg-gray-700 rounded hover:bg-gray-600 text-gray-300"
                    title="Regenerate Key"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-900/20 p-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth className="mt-4 text-lg py-3">
            Finish Setup Mode
          </Button>
        </form>
      </div>
    </div>
  );
};
