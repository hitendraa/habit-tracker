import { useHabits } from '../../lib/habit-context';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function WeeklyProgress() {
  const { habits } = useHabits();

  // Get current week's dates
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Calculate daily completion rates
  const dailyStats = weekDates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completionHistory?.[dateStr]).length;
    return {
      date,
      label: format(date, 'EEE'),
      completed: completedHabits,
      total: totalHabits,
      rate: totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0
    };
  });

  // Calculate weekly stats
  const totalCompletions = dailyStats.reduce((sum, day) => sum + day.completed, 0);
  const totalPossible = dailyStats.reduce((sum, day) => sum + day.total, 0);
  const weeklyRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;

  // Calculate trend
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayStats = dailyStats.find(d => format(d.date, 'yyyy-MM-dd') === today);
  const yesterday = new Date(Date.now() - 86400000);
  const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
  const yesterdayStats = dailyStats.find(d => format(d.date, 'yyyy-MM-dd') === yesterdayStr);
  const trend = yesterdayStats && todayStats ? todayStats.rate - yesterdayStats.rate : 0;
  return (
    <div className="bg-card text-card-foreground rounded-xl p-4 shadow-sm border border-border/50">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Weekly Progress</h2>
          <div className="text-sm text-muted-foreground">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d')}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center text-sm ${trend >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
            {trend >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        </div>
      </div>      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground mb-1">
          <span>Overall Progress</span>
          <span>{weeklyRate.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${weeklyRate}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {dailyStats.map((day, i) => {
          const height = Math.max(20, day.rate);
          const isToday = format(day.date, 'yyyy-MM-dd') === today;
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className="flex-1 w-full flex items-end">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isToday ? 'bg-primary' : 'bg-primary/30'
                  }`}
                  style={{ height: `${height}px` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{day.label}</div>
              <div className="text-xs font-medium">
                {day.completed}/{day.total}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">Weekly Summary</div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalCompletions}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-2 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {Math.max(...dailyStats.map(d => d.rate)).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Best Day</div>
          </div>
        </div>
      </div>
    </div>
  );
}
