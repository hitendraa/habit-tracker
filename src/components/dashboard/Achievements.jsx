import { ScrollArea } from '../ui/scroll-area';
import { useAchievements } from '../../lib/achievement-context';
import { motion } from 'framer-motion';

export function Achievements() {
  const { achievements, ACHIEVEMENTS } = useAchievements();

  // Filter achieved ones first, then unachieved
  const sortedAchievements = [
    ...achievements.map(id => ({ ...ACHIEVEMENTS[id], achieved: true })),
    ...Object.values(ACHIEVEMENTS)
      .filter(a => !achievements.includes(a.id))
      .map(a => ({ ...a, achieved: false }))
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">Achievements</h2>
          <p className="text-sm text-gray-500">{achievements.length} of {Object.keys(ACHIEVEMENTS).length} unlocked</p>
        </div>
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-3 pr-4">
          {sortedAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              initial={achievement.achieved ? { scale: 1.1, opacity: 0 } : {}}
              animate={{ scale: 1, opacity: 1 }}
              className={`rounded-lg p-3 flex items-center gap-3 transition-all
                ${achievement.achieved 
                  ? `bg-${achievement.color}-50 hover:shadow-md` 
                  : 'bg-gray-50 opacity-60'
                }`}
            >
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xl
                ${achievement.achieved 
                  ? `bg-${achievement.color}-200` 
                  : 'bg-gray-200'
                }`}
              >
                {achievement.emoji}
              </div>
              <div className="flex-1">
                <div className="font-medium">{achievement.title}</div>
                <div className="text-sm text-gray-500">{achievement.description}</div>
              </div>
              {achievement.achieved ? (
                <div className={`h-8 w-8 bg-${achievement.color}-100 rounded-full 
                  flex items-center justify-center text-${achievement.color}-600 
                  font-bold text-sm`}
                >
                  +{achievement.points}
                </div>
              ) : (
                <div className="h-8 w-8 bg-gray-100 rounded-full 
                  flex items-center justify-center text-gray-400 
                  font-bold text-sm"
                >
                  🔒
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
