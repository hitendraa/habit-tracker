import { useState } from 'react';
import { Search } from 'lucide-react';
import { useHabits } from '../../lib/habit-context';
import { format, subDays, startOfDay } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';

export function FavoriteHabits() {
  const { habits } = useHabits();
  const [searchQuery, setSearchQuery] = useState('');

  // Get the last 5 days
  const days = Array.from({ length: 5 }, (_, i) => {
    const date = subDays(new Date(), 4 - i);
    return {
      date,
      label: format(date, 'EEE d'),
      dateStr: format(date, 'yyyy-MM-dd')
    };
  });

  // Calculate completion rates for each habit
  const habitStats = habits.map(habit => {
    const completions = days.filter(day => habit.completionHistory?.[day.dateStr]).length;
    const rate = (completions / days.length) * 100;
    const streak = calculateStreak(habit.completionHistory || {});
    
    return {
      ...habit,
      completionRate: rate,
      recentCompletions: completions,
      streak
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  // Filter habits based on search
  const filteredHabits = habitStats.filter(habit =>
    habit.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function calculateStreak(history) {
    let streak = 0;
    let date = startOfDay(new Date());
    
    while (history[format(date, 'yyyy-MM-dd')]) {
      streak++;
      date = subDays(date, 1);
    }
    
    return streak;
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Top Habits</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search habits"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-1 border rounded-lg text-sm w-48"
          />
        </div>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {filteredHabits.map(habit => {
            const completionHeight = Math.max(20, habit.completionRate);
            const streakBonus = habit.streak > 0 ? `+${habit.streak}🔥` : '';
            
            return (
              <div key={habit.id} className="relative">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{habit.emoji}</span>
                    <span className="font-medium">{habit.text}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {habit.completionRate.toFixed(0)}% {streakBonus}
                  </div>
                </div>
                
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${habit.color}-400 rounded-full transition-all duration-500`}
                    style={{ width: `${habit.completionRate}%` }}
                  />
                </div>

                <div className="grid grid-cols-5 gap-1 mt-1">
                  {days.map((day) => (
                    <div
                      key={day.dateStr}
                      className={`text-xs text-center py-1 rounded ${
                        habit.completionHistory?.[day.dateStr]
                          ? `bg-${habit.color}-100 text-${habit.color}-700`
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {day.label}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredHabits.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No habits found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
