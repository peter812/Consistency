import React, { useState, useMemo, useEffect } from 'react';
import { Habit, HabitDayStatus } from '../types';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { MoreHorizontal, Check, Trash2, X } from 'lucide-react';
import { saveHabitDayStatus, deleteHabit } from '../services/storage';

interface HabitCardProps {
  habit: Habit;
  statuses: HabitDayStatus[];
  onRefresh: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, statuses, onRefresh }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [todayNote, setTodayNote] = useState('');
  
  // Memoize date calculation
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);

  // Find today's status
  const todayStatus = useMemo(() => {
    return statuses.find(s => s.date === todayStr);
  }, [statuses, todayStr]);

  const [isOnTrack, setIsOnTrack] = useState(false);

  useEffect(() => {
    if (todayStatus) {
      setIsOnTrack(todayStatus.onTrack);
      setTodayNote(todayStatus.note || '');
    } else {
      setIsOnTrack(false);
      setTodayNote('');
    }
  }, [todayStatus]);

  const handleUpdateToday = (newOnTrack: boolean, newNote: string) => {
    setIsOnTrack(newOnTrack);
    setTodayNote(newNote);
    
    // Save to DB (mock)
    saveHabitDayStatus({
      habitUuid: habit.uuid,
      date: todayStr,
      onTrack: newOnTrack,
      note: newNote
    });
    
    // We don't call onRefresh immediately to avoid jitter, 
    // but in a real app with optimistic updates, we might.
    // For local storage, a delay or sync is fine.
    setTimeout(onRefresh, 100);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.uuid);
      onRefresh();
    }
  };

  // Generate last 30 days
  const last30Days = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = subDays(today, i);
      const dStr = format(d, 'yyyy-MM-dd');
      const status = statuses.find(s => s.date === dStr);
      days.push({
        date: d,
        dateStr: dStr,
        status: status
      });
    }
    return days;
  }, [today, statuses]);

  return (
    <div className={`rounded-xl shadow-lg overflow-hidden flex flex-col ${habit.color} text-white transition-transform hover:scale-[1.01]`}>
      
      {/* Top Section */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold truncate pr-2">{habit.title}</h3>
            {habit.description && (
              <p className="text-white/60 text-sm truncate">{habit.description}</p>
            )}
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-black/20 rounded transition-colors"
            >
              <MoreHorizontal size={24} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10 overflow-hidden">
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Delete Habit
                </button>
                <button
                  onClick={() => setShowMenu(false)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 hover:bg-gray-700 flex items-center gap-2"
                >
                  <X size={16} /> Close Menu
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Today's Monitor */}
        <div className="bg-black/20 rounded-lg p-3 flex items-center gap-3">
          <button
            onClick={() => handleUpdateToday(!isOnTrack, todayNote)}
            className={`flex-shrink-0 w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
              isOnTrack 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-white/30 hover:border-white/60'
            }`}
          >
            {isOnTrack && <Check size={20} strokeWidth={3} />}
          </button>
          
          <input
            type="text"
            value={todayNote}
            onChange={(e) => handleUpdateToday(isOnTrack, e.target.value)}
            placeholder="Add a note for today..."
            className="flex-1 bg-transparent border-none text-white placeholder-white/40 focus:ring-0 text-sm"
          />
        </div>
      </div>

      {/* Bottom Section: 30 Day Heatmap */}
      <div className="mt-auto bg-black/30 p-4">
        <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-semibold">Last 30 Days</p>
        <div className="flex gap-1 justify-between">
          {last30Days.map((day, idx) => {
            const isToday = day.dateStr === todayStr;
            const isOnTrackDay = day.status?.onTrack;
            
            return (
              <div
                key={day.dateStr}
                className="group relative flex-1 aspect-[1/1.5] sm:aspect-square"
              >
                <div 
                  className={`w-full h-full rounded-sm transition-opacity ${
                    isOnTrackDay 
                      ? 'bg-green-400' 
                      : 'bg-white/10'
                  } ${isToday ? 'ring-1 ring-white' : ''}`}
                />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-20">
                  <div className="bg-gray-900 text-xs rounded py-1 px-2 border border-gray-700 shadow-xl">
                    <p className="font-bold text-gray-300 mb-1">{format(day.date, 'MMM d')}</p>
                    <p className={isOnTrackDay ? 'text-green-400' : 'text-red-400'}>
                      {isOnTrackDay ? 'On Track' : 'Missed'}
                    </p>
                    {day.status?.note && (
                      <p className="text-gray-400 mt-1 italic border-t border-gray-700 pt-1">"{day.status.note}"</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
