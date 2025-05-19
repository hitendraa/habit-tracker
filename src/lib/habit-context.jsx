import { createContext, useContext, useState, useEffect } from 'react';

const HabitContext = createContext();

// Initialize habits from localStorage
const getInitialHabits = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits);
      // Validate the data structure
      if (Array.isArray(parsed) && parsed.every(habit => 
        habit && 
        typeof habit === 'object' && 
        'id' in habit && 
        'text' in habit
      )) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error loading habits:', error);
  }
  return [];
};

export function HabitProvider({ children }) {
  // Use the initialization function directly in useState
  const [habits, setHabits] = useState(getInitialHabits);

  // Save to localStorage whenever habits change
  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  }, [habits]);

  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now(),
      text: habit.text,
      completed: false,
      createdAt: new Date().toISOString(),
      emoji: habit.emoji || "⭐",
      color: habit.color || ["blue", "green", "purple", "amber", "rose", "teal", "indigo", "orange"][
        Math.floor(Math.random() * 8)
      ],
      streak: 0,
      completionHistory: {},
      lastCompleted: null
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
  };

  const toggleHabit = (id) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prevHabits => prevHabits.map(habit => {
      if (habit.id === id) {
        const wasCompletedToday = habit.completionHistory?.[today];
        const newCompletionHistory = { ...habit.completionHistory };
        
        if (!wasCompletedToday) {
          newCompletionHistory[today] = true;
        } else {
          delete newCompletionHistory[today];
        }

        // Calculate streak
        let currentStreak = 0;
        let date = new Date();
        while (newCompletionHistory[date.toISOString().split('T')[0]]) {
          currentStreak++;
          date.setDate(date.getDate() - 1);
        }

        return {
          ...habit,
          completed: !wasCompletedToday,
          completionHistory: newCompletionHistory,
          lastCompleted: !wasCompletedToday ? today : habit.lastCompleted,
          streak: currentStreak
        };
      }
      return habit;
    }));
  };

  const updateHabit = (id, updates) => {
    setHabits(prevHabits => prevHabits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (id) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== id));
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, toggleHabit, updateHabit, deleteHabit }}>
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};