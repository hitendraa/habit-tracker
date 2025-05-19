export function MobileAppPromo() {
  return (    <div className="bg-card text-card-foreground rounded-xl p-3 shadow-sm relative overflow-hidden border border-border/50">
      <div className="flex items-center">
        <div className="w-1/4">
          <div className="w-[60px] h-[60px] bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
            📱
          </div>
        </div>
        <div className="w-3/4">
          <h3 className="text-base font-bold">Mobile App Coming Soon!</h3>
          <p className="text-muted-foreground text-xs mb-2">Be the first to try our mobile app.</p>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-3 py-1 text-xs transition-colors">Join Waitlist</button>
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <div className="h-5 w-5 bg-yellow-300 rounded-full flex items-center justify-center">✨</div>
      </div>
    </div>
  )
}
