import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useHabits } from '../../lib/habit-context';
import { ScrollArea } from '../ui/scroll-area';

const ALL_SUGGESTIONS = [
  {
    id: 1,
    title: "We go jjjmmm!!",
    emoji: "💪",
    likes: 4200,
    bgColor: "amber",
  },
  {
    id: 2,
    title: "The 5am club",
    emoji: "⏰",
    likes: 5400,
    bgColor: "red",
  },
  {
    id: 3,
    title: "Read 10 pages daily",
    emoji: "📚",
    likes: 3800,
    bgColor: "blue",
  },
  {
    id: 4,
    title: "Meditate for 10 mins",
    emoji: "🧘",
    likes: 6200,
    bgColor: "purple",
  },
  {
    id: 5,
    title: "Daily coding practice",
    emoji: "💻",
    likes: 4800,
    bgColor: "indigo",
  },
  {
    id: 6,
    title: "Drink 8 glasses of water",
    emoji: "💧",
    likes: 5100,
    bgColor: "blue",
  },
  {
    id: 7,
    title: "Practice gratitude",
    emoji: "🙏",
    likes: 4900,
    bgColor: "green",
  },
  {
    id: 8,
    title: "Learn something new",
    emoji: "🧠",
    likes: 5200,
    bgColor: "rose",
  },
  {
    id: 9,
    title: "10k steps daily",
    emoji: "👣",
    likes: 5800,
    bgColor: "teal",
  },
  {
    id: 10,
    title: "Write in journal",
    emoji: "✍️",
    likes: 4100,
    bgColor: "orange",
  },
  {
    id: 11,
    title: "Evening yoga",
    emoji: "🌙",
    likes: 4700,
    bgColor: "purple",
  },
  {
    id: 12,
    title: "Learn an instrument",
    emoji: "🎸",
    likes: 3900,
    bgColor: "amber",
  },
  {
    id: 13,
    title: "Practice drawing",
    emoji: "🎨",
    likes: 4300,
    bgColor: "rose",
  },
  {
    id: 14,
    title: "Cook healthy meals",
    emoji: "🥗",
    likes: 5600,
    bgColor: "green",
  },
  {
    id: 15,
    title: "Daily stretching",
    emoji: "🤸",
    likes: 4400,
    bgColor: "teal",
  }
];

export function SuggestedHabits() {
  const { addHabit } = useHabits();
  const [suggestions] = useState(() => {
    return [...ALL_SUGGESTIONS]
      .sort(() => Math.random() - 0.5)
      .slice(0, ALL_SUGGESTIONS.length);
  });

  const handleAddHabit = (suggestion) => {
    addHabit({
      text: suggestion.title,
      emoji: suggestion.emoji,
      color: suggestion.bgColor
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">Suggested Habits</h2>
      <ScrollArea className="h-[250px]">
        <div className="space-y-2 pr-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`bg-${suggestion.bgColor}-50 rounded-lg p-2 flex items-center gap-2 transition-all duration-200 hover:shadow-sm group`}
            >
              <div className={`bg-${suggestion.bgColor}-100 h-8 w-8 rounded-lg flex items-center justify-center text-base shrink-0`}>
                {suggestion.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{suggestion.title}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <span>👍</span> {(suggestion.likes / 1000).toFixed(1)}k
                </div>
              </div>
              <button
                onClick={() => handleAddHabit(suggestion)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-lg"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
