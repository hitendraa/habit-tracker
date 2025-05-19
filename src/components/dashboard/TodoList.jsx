import { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, Circle, Smile } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useHabits } from '../../lib/habit-context';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/utils";

const HABIT_EMOJIS = ["🏃", "📚", "💪", "🧘", "🎨", "🎵", "🌱", "💻", "🎯", "⭐"];
const HABIT_COLORS = ["blue", "green", "purple", "amber", "rose", "teal", "indigo", "orange"];

export function TodoList() {
  const { habits: todos, addHabit, toggleHabit, updateHabit, deleteHabit } = useHabits();
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState("⭐");
  const today = format(new Date(), 'yyyy-MM-dd');

  const addTodo = () => {
    if (!newTodo.trim()) return;
    addHabit({
      text: newTodo,
      emoji: selectedEmoji,
      color: HABIT_COLORS[Math.floor(Math.random() * HABIT_COLORS.length)]
    });
    setNewTodo('');
    setSelectedEmoji("⭐");
  };

  const handleToggle = (id) => {
    toggleHabit(id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(id);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setNewTodo(todo.text);
    setSelectedEmoji(todo.emoji);
  };

  const updateTodo = () => {
    if (!newTodo.trim()) return;
    updateHabit(editingId, {
      text: newTodo,
      emoji: selectedEmoji
    });
    setEditingId(null);
    setNewTodo('');
    setSelectedEmoji("⭐");
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Habits</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Habit</DialogTitle>
            </DialogHeader>
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
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (editingId ? updateTodo() : addTodo())}
                  className="flex-1"
                />
              </div>
              <Button 
                onClick={editingId ? updateTodo : addTodo}
                className="w-full"
              >
                {editingId ? 'Update Habit' : 'Add Habit'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="space-y-3 pr-4">
          {todos.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <Smile className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No habits yet! Add your first habit to get started.</p>
            </div>
          ) : (
            todos.map(todo => {
              const completedToday = todo.completionHistory?.[today];
              return (
                <div
                  key={todo.id}
                  className={cn(
                    "rounded-lg p-3 flex items-center gap-3 transition-all duration-200 hover:shadow-md",
                    `bg-${todo.color}-50`
                  )}
                >
                  <button
                    onClick={() => handleToggle(todo.id)}
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center text-xl transition-transform hover:scale-105",
                      `bg-${todo.color}-200`
                    )}
                  >
                    {completedToday ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <span>{todo.emoji}</span>
                    )}
                  </button>
                  <div className="flex-1">
                    <div className={cn(
                      "font-medium",
                      completedToday && "text-gray-400"
                    )}>
                      {todo.text}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <span>🔥</span> {todo.streak} day streak
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!completedToday && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEditing(todo)}
                        className="h-8 w-8 hover:bg-gray-100"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(todo.id)}
                      className="h-8 w-8 hover:bg-red-100 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
