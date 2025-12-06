import React, { useState, useEffect } from 'react';
import { UserConfig, Habit, HabitDayStatus } from '../types';
import { LogOut, Plus } from 'lucide-react';
import { getHabits, getAllHabitStatuses } from '../services/storage';
import { HabitCard } from './HabitCard';
import { HabitModal } from './HabitModal';
import { Button } from './Button';

interface DashboardProps {
  user: UserConfig;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [statuses, setStatuses] = useState<HabitDayStatus[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshData = () => {
    const loadedHabits = getHabits();
    // Sort by creation date
    loadedHabits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setHabits(loadedHabits);
    setStatuses(getAllHabitStatuses());
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Menu Bar */}
      <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">C</div>
            <span className="text-xl font-bold text-white tracking-tight">Consistency<span className="text-blue-500">App</span></span>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 text-sm"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Add Habit</span>
            </Button>
            
            <div className="h-6 w-px bg-gray-800 mx-1"></div>
            
            <button 
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-20">
             <div className="inline-block p-6 bg-gray-900 rounded-full mb-4">
               <Plus className="w-12 h-12 text-gray-700" />
             </div>
             <h3 className="text-xl font-medium text-white mb-2">No habits tracked yet</h3>
             <p className="text-gray-500 mb-6">Start building consistency by adding your first habit.</p>
             <Button onClick={() => setIsModalOpen(true)}>Create First Habit</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map(habit => (
              <HabitCard
                key={habit.uuid}
                habit={habit}
                statuses={statuses.filter(s => s.habitUuid === habit.uuid)}
                onRefresh={refreshData}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <HabitModal 
          onClose={() => setIsModalOpen(false)}
          onSave={refreshData}
        />
      )}
    </div>
  );
};
