import React, { useState } from 'react';
import { X } from 'lucide-react';
import { HABIT_COLORS, DEFAULT_HABIT_COLOR } from '../constants';
import { Button } from './Button';
import { saveHabit } from '../services/storage';

interface HabitModalProps {
  onClose: () => void;
  onSave: () => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEFAULT_HABIT_COLOR);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    saveHabit({
      uuid: crypto.randomUUID(),
      title,
      description,
      color: selectedColor.value,
      createdAt: new Date().toISOString()
    });
    
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-800 flex flex-col animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Create New Habit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Habit Name *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Read 30 mins"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea 
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Motivational details..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Color Theme</label>
            <div className="grid grid-cols-5 gap-3">
              {HABIT_COLORS.map(color => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${color.value} ${
                    selectedColor.id === color.id ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                  }`}
                  title={color.name}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">Selected: {selectedColor.name}</p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Habit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
