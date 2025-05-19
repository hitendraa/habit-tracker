import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useHabits } from '../../lib/habit-context';

// Combine all suggestions from categories
const HABIT_CATEGORIES = {
  "Health & Fitness": [
    { title: "Morning Exercise", emoji: "🏃", likes: 8200, color: "green" },
    { title: "Yoga Session", emoji: "🧘", likes: 7400, color: "purple" },
    { title: "8 Hours Sleep", emoji: "😴", likes: 9100, color: "blue" },
    { title: "Healthy Breakfast", emoji: "🥗", likes: 6800, color: "teal" },
  ],
  "Mindfulness": [
    { title: "Daily Meditation", emoji: "🧘", likes: 7200, color: "purple" },
    { title: "Gratitude Journal", emoji: "📔", likes: 5900, color: "rose" },
    { title: "Digital Detox Hour", emoji: "📵", likes: 4800, color: "orange" },
  ],
  "Learning": [
    { title: "Read 30 Minutes", emoji: "📚", likes: 6500, color: "amber" },
    { title: "Learn Language", emoji: "🗣️", likes: 5400, color: "indigo" },
    { title: "Practice Coding", emoji: "💻", likes: 7800, color: "blue" },
  ],
  "Productivity": [
    { title: "No Social Media", emoji: "🚫", likes: 4200, color: "red" },
    { title: "Early Morning Start", emoji: "🌅", likes: 6100, color: "amber" },
    { title: "To-Do List", emoji: "📝", likes: 5300, color: "green" },
  ],
  "Creativity": [
    { title: "Daily Drawing", emoji: "🎨", likes: 4100, color: "rose" },
    { title: "Write Story", emoji: "✍️", likes: 3900, color: "purple" },
    { title: "Play Music", emoji: "🎵", likes: 4500, color: "blue" },
  ],
};

export function HabitBrowser() {
  const { addHabit } = useHabits();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleAddHabit = (habit) => {
    addHabit({
      text: habit.title,
      emoji: habit.emoji,
      color: habit.color
    });
    document.querySelector('[role="dialog"]')?.close();
  };

  const filteredHabits = Object.entries(HABIT_CATEGORIES).flatMap(([category, habits]) => {
    if (selectedCategory !== "all" && category !== selectedCategory) return [];
    return habits.filter(habit => 
      habit.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
      <DialogHeader>
        <DialogTitle>Browse Popular Habits</DialogTitle>
      </DialogHeader>
      
      <div className="flex gap-2 my-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search habits..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select 
          className="border rounded-lg px-3 py-2"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {Object.keys(HABIT_CATEGORIES).map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <ScrollArea className="flex-1 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map((habit, index) => (
            <div
              key={index}
              className={`bg-${habit.color}-50 rounded-lg p-3 flex items-center gap-3 transition-all duration-200 hover:shadow-md`}
            >
              <div className={`bg-${habit.color}-200 h-10 w-10 rounded-lg flex items-center justify-center text-xl`}>
                {habit.emoji}
              </div>
              <div className="flex-1">
                <div className="font-medium">{habit.title}</div>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <span>👍</span> {(habit.likes / 1000).toFixed(1)}k love this
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleAddHabit(habit)}
                className="h-8 w-8 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </DialogContent>
  );
}
