interface DayCounterProps {
  currentDay: number
  maxDays?: number
}

export default function DayCounter({ currentDay, maxDays = 3 }: DayCounterProps) {
  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-amber-900/90 backdrop-blur-sm border-2 border-amber-600 rounded-lg px-6 py-3 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-amber-300 text-sm font-semibold tracking-wider">
            JOUR
          </span>
          <span className="text-white text-2xl font-bold">
            {currentDay}/{maxDays}
          </span>
        </div>
        
        {/* Barre de progression visuelle */}
        <div className="mt-2 flex gap-1">
          {Array.from({ length: maxDays }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index < currentDay
                  ? 'bg-amber-400'
                  : 'bg-amber-900/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
