import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useHabits } from '../../lib/habit-context';

const HABIT_EMOJIS = ["🏃", "📚", "💪", "🧘", "🎨", "🎵", "🌱", "💻", "🎯", "⭐"];
const HABIT_COLORS = ["blue", "green", "purple", "amber", "rose", "teal", "indigo", "orange"];

export function AddHabitForm({ onClose }) {
  const { addHabit } = useHabits();
  const [newHabit, setNewHabit] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState("⭐");

  const handleSubmit = () => {
    if (!newHabit.trim()) return;
    addHabit({
      text: newHabit,
      emoji: selectedEmoji,
      color: HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)]
    });
    setNewHabit('');
    setSelectedEmoji("⭐");
    onClose?.();
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <span className="text-xl">{selectedEmoji}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="grid grid-cols-5 gap-1 p-2">
              {HABIT_EMOJIS.map((emoji) => (
                <DropdownMenuItem
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  className="cursor-pointer p-2 hover:bg-gray-100 rounded"
                >
                  <span className="text-xl">{emoji}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          type="text"
          placeholder="Enter your habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="flex-1"
        />
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Add Habit
      </Button>
    </div>
  );
}
