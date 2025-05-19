export function FriendsActivity() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Friends Activity</h2>
        <button className="text-gray-500 text-sm">View All</button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white font-bold">
            SM
          </div>
          <div className="flex-1">
            <div className="font-medium">Sarah M.</div>
            <div className="text-sm text-gray-500">Completed morning yoga 🧘‍♀️</div>
          </div>
          <div className="text-xs text-gray-400">2m ago</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="flex-1">
            <div className="font-medium">John D.</div>
            <div className="text-sm text-gray-500">Hit 10k steps goal 🚶</div>
          </div>
          <div className="text-xs text-gray-400">15m ago</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
            AK
          </div>
          <div className="flex-1">
            <div className="font-medium">Alex K.</div>
            <div className="text-sm text-gray-500">Started meditation streak ✨</div>
          </div>
          <div className="text-xs text-gray-400">25m ago</div>
        </div>
      </div>
    </div>
  )
}
