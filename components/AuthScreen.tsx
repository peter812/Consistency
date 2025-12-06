import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface AuthScreenProps {
  storedPin: string;
  userName: string;
  onSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ storedPin, userName, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumClick = (num: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (pin.length === storedPin.length) {
      if (pin === storedPin) {
        // Add slight delay for UX
        setTimeout(() => onSuccess(), 200);
      } else {
        setError(true);
        setTimeout(() => setPin(''), 500);
      }
    }
  }, [pin, storedPin, onSuccess]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 p-4">
      <div className="mb-8 text-center">
        <div className="inline-block p-4 bg-gray-800 rounded-full mb-4 ring-2 ring-gray-700">
          <Lock className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Welcome back, {userName}</h2>
        <p className="text-gray-500 mt-2">Enter your PIN to continue</p>
      </div>

      <div className="mb-8 flex justify-center gap-4 h-8">
        {[...Array(storedPin.length)].map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              i < pin.length 
                ? error ? 'bg-red-500' : 'bg-blue-500 scale-125' 
                : 'bg-gray-800'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumClick(num.toString())}
            className="w-20 h-20 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-2xl font-semibold text-white transition-all active:scale-95"
          >
            {num}
          </button>
        ))}
        <div className="w-20 h-20"></div>
        <button
          onClick={() => handleNumClick('0')}
          className="w-20 h-20 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-800 text-2xl font-semibold text-white transition-all active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-20 h-20 rounded-full bg-transparent hover:bg-gray-900 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
