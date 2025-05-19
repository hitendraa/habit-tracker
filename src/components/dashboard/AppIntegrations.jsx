export function AppIntegrations() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Spotify Integration */}
      <div className="bg-white rounded-lg p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎵</span>
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-medium">Spotify</h3>
            <p className="text-[10px] text-gray-500">Track with music</p>
          </div>
        </div>

        <div className="mt-2">
          <button className="w-full bg-gray-900 text-white rounded-full py-1 text-xs flex items-center justify-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-white flex items-center justify-center">
              <span className="text-black text-[8px]">🔗</span>
            </span>
            <span>Connect</span>
          </button>
        </div>
      </div>

      {/* More Integrations */}
      <div className="bg-red-400 rounded-lg p-2 shadow-sm text-white">
        <div className="h-full flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium">23+ Apps</h3>
            <p className="text-[10px] mt-0.5">Connect more apps</p>
          </div>
          <button className="w-full bg-white/20 hover:bg-white/30 text-white rounded-full py-1 text-xs mt-2">
            Explore
          </button>
        </div>
      </div>
    </div>
  )
}
