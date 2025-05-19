import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabits } from '../../lib/habit-context';
import { ScrollArea } from '../ui/scroll-area';

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { habits } = useHabits();
  
  const completionData = habits.reduce((acc, habit) => {
    Object.keys(habit.completionHistory || {}).forEach(date => {
      if (!acc[date]) acc[date] = 0;
      acc[date]++;
    });
    return acc;
  }, {});

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  
  const lastMonth = eachDayOfInterval({ 
    start: startOfMonth(subMonths(currentDate, 1)), 
    end: endOfMonth(subMonths(currentDate, 1)) 
  });
  
  const thisMonthCompletions = daysInMonth.reduce((acc, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return acc + (completionData[dateStr] || 0);
  }, 0);
  
  const lastMonthCompletions = lastMonth.reduce((acc, date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return acc + (completionData[dateStr] || 0);
  }, 0);
  
  const completionChange = lastMonthCompletions === 0 ? 100 : 
    ((thisMonthCompletions - lastMonthCompletions) / lastMonthCompletions) * 100;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{format(currentDate, 'MMMM, yyyy')}</h2>
        <div className="flex gap-2">
          <button 
            onClick={previousMonth}
            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={nextMonth}
            className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
          <div key={i} className="text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}

        {daysInMonth.map((date, i) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const completionsToday = completionData[dateStr] || 0;
          const isToday = format(new Date(), 'yyyy-MM-dd') === dateStr;
          
          return (
            <div
              key={i}
              className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all
                ${completionsToday > 0 ? "bg-orange-100" : ""}
                ${completionsToday > 2 ? "bg-orange-200" : ""}
                ${completionsToday > 4 ? "bg-orange-300" : ""}
                ${isToday ? "ring-2 ring-orange-400" : ""}
                hover:bg-orange-50
              `}
              title={`${completionsToday} habits completed`}
            >
              {format(date, 'd')}
            </div>
          );
        })}
      </div>

      <div className={`mt-4 text-sm font-medium ${completionChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {completionChange > 0 ? '+' : ''}{completionChange.toFixed(1)}% from last month
      </div>

      <ScrollArea className="mt-4 h-24">
        <div className="space-y-2">
          {habits.map(habit => {
            const completedToday = habit.completionHistory?.[format(new Date(), 'yyyy-MM-dd')];
            return (
              <div key={habit.id} className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${completedToday ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className={completedToday ? 'text-gray-900' : 'text-gray-500'}>
                  {habit.text}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
