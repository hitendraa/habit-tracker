import { createContext, useContext, useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import confetti from 'canvas-confetti';

const AchievementContext = createContext();

// Predefined achievements
const ACHIEVEMENTS = {
  EARLY_STARTER: {
    id: 'EARLY_STARTER',
    title: 'Early Starter',
    description: 'Complete your first habit',
    emoji: '🌟',
    points: 5,
    color: 'purple',
    condition: (stats) => stats.totalCompletions >= 1
  },
  HABIT_MASTER: {
    id: 'HABIT_MASTER',
    title: 'Habit Master',
    description: 'Complete 50 habits',
    emoji: '👑',
    points: 20,
    color: 'amber',
    condition: (stats) => stats.totalCompletions >= 50
  },
  STREAK_WARRIOR: {
    id: 'STREAK_WARRIOR',
    title: 'Streak Warrior',
    description: 'Maintain a 7-day streak',
    emoji: '⚔️',
    points: 15,
    color: 'red',
    condition: (stats) => stats.maxStreak >= 7
  },
  CONSISTENCY_KING: {
    id: 'CONSISTENCY_KING',
    title: 'Consistency King',
    description: 'Complete all habits for 3 days straight',
    emoji: '👑',
    points: 25,
    color: 'blue',
    condition: (stats) => stats.perfectDays >= 3
  },
  EARLY_BIRD: {
    id: 'EARLY_BIRD',
    title: 'Early Bird',
    description: 'Complete a habit before 8 AM',
    emoji: '🌅',
    points: 10,
    color: 'orange',
    condition: (stats) => stats.earlyCompletions >= 1
  },
  NIGHT_OWL: {
    id: 'NIGHT_OWL',
    title: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    emoji: '🦉',
    points: 10,
    color: 'indigo',
    condition: (stats) => stats.lateCompletions >= 1
  },
  VARIETY_MASTER: {
    id: 'VARIETY_MASTER',
    title: 'Variety Master',
    description: 'Have 5 different active habits',
    emoji: '🎨',
    points: 15,
    color: 'green',
    condition: (stats) => stats.activeHabits >= 5
  },
  PERFECT_WEEK: {
    id: 'PERFECT_WEEK',
    title: 'Perfect Week',
    description: 'Complete all habits for an entire week',
    emoji: '🏆',
    points: 50,
    color: 'yellow',
    condition: (stats) => stats.perfectDays >= 7
  }
};

const getInitialState = () => {
  if (typeof window === 'undefined') return { achievements: [], stats: {} };
  
  try {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
  return { achievements: [], stats: {} };
};

export function AchievementProvider({ children }) {
  const [state, setState] = useState(getInitialState);
  const { achievements, stats } = state;

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(state));
  }, [state]);

  const checkForNewAchievements = (newStats) => {
    Object.values(ACHIEVEMENTS).forEach(achievement => {
      if (!achievements.includes(achievement.id) && achievement.condition(newStats)) {
        // Award new achievement
        setState(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id]
        }));

        // Show celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Show toast notification
        toast.custom((t) => (
          <div className={`bg-${achievement.color}-50 rounded-lg p-4 shadow-lg border border-${achievement.color}-200`}>
            <div className="flex items-center gap-3">
              <div className={`bg-${achievement.color}-200 h-12 w-12 rounded-lg flex items-center justify-center text-xl`}>
                {achievement.emoji}
              </div>
              <div>
                <div className="font-bold text-lg">Achievement Unlocked!</div>
                <div className="font-medium">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
                <div className="text-sm font-medium text-${achievement.color}-600 mt-1">
                  +{achievement.points} points
                </div>
              </div>
            </div>
          </div>
        ));
      }
    });
  };

  const updateStats = (habitData) => {
    const newStats = {
      totalCompletions: habitData.totalCompletions || 0,
      maxStreak: habitData.maxStreak || 0,
      perfectDays: habitData.perfectDays || 0,
      earlyCompletions: habitData.earlyCompletions || 0,
      lateCompletions: habitData.lateCompletions || 0,
      activeHabits: habitData.activeHabits || 0
    };

    setState(prev => ({
      ...prev,
      stats: newStats
    }));

    checkForNewAchievements(newStats);
  };

  const value = {
    achievements,
    stats,
    updateStats,
    ACHIEVEMENTS
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
      <Toaster 
        position="top-right"
        expand={true}
        richColors
        duration={5000}
      />
    </AchievementContext.Provider>
  );
}

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};
