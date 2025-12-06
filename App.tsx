import React, { useEffect, useState } from 'react';
import { UserConfig, AppState } from './types';
import { getStoredUserConfig } from './services/storage';
import { SetupScreen } from './components/SetupScreen';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [userConfig, setUserConfig] = useState<UserConfig | null>(null);

  useEffect(() => {
    // Check initialization
    const config = getStoredUserConfig();
    if (config && config.isSetupComplete) {
      setUserConfig(config);
      setAppState(AppState.AUTH);
    } else {
      setAppState(AppState.SETUP);
    }
  }, []);

  const handleSetupComplete = () => {
    const config = getStoredUserConfig();
    setUserConfig(config);
    // After setup, go straight to auth to confirm PIN
    setAppState(AppState.AUTH); 
  };

  const handleAuthSuccess = () => {
    setAppState(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    setAppState(AppState.AUTH);
  };

  if (appState === AppState.LOADING) {
    return <div className="min-h-screen bg-gray-950" />;
  }

  if (appState === AppState.SETUP) {
    return <SetupScreen onComplete={handleSetupComplete} />;
  }

  if (appState === AppState.AUTH && userConfig) {
    return (
      <AuthScreen 
        storedPin={userConfig.pin} 
        userName={userConfig.name}
        onSuccess={handleAuthSuccess} 
      />
    );
  }

  if (appState === AppState.DASHBOARD && userConfig) {
    return (
      <Dashboard 
        user={userConfig} 
        onLogout={handleLogout} 
      />
    );
  }

  // Fallback
  return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">Error: Unknown State</div>;
};

export default App;
