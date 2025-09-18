'use client'
import React, { useEffect, useRef, useState } from 'react'

const ConferenceTry: React.FC = () => {
  const count = 100
  const [share, setShare] = useState(false)
  const [side, setSide] = useState(false)

  const participantRef = useRef<HTMLDivElement>(null)
  const [maxTiles, setMaxTiles] = useState(15)

  const aspectRatio = 4 / 3
  const estimatedTileWidth = 150
  const gap = 8 // Tailwind gap-2 = 0.5rem = 8px

  const calculateMaxTiles = () => {
    const width = participantRef.current?.offsetWidth ?? window.innerWidth
    const height = participantRef.current?.offsetHeight ?? window.innerHeight

    const maxCols = Math.floor((width + gap) / (estimatedTileWidth + gap)) || 1
    const tileWidth = (width - gap * (maxCols - 1)) / maxCols
    const tileHeight = tileWidth / aspectRatio

    const maxRows = Math.floor((height + gap) / (tileHeight + gap))
    const maxFit = maxCols * maxRows

    const cappedFit = Math.min(maxFit, 15) // Cap only if screen allows
    setMaxTiles(Math.max(1, cappedFit))
  }

  useEffect(() => {
    calculateMaxTiles()

    const observer = new ResizeObserver(() => calculateMaxTiles())
    if (participantRef.current) observer.observe(participantRef.current)

    return () => observer.disconnect()
  }, [share, side])

  const showOnlyOverflow = maxTiles === 1
  const isOverflow = count > maxTiles
  let visibleUsers = showOnlyOverflow ? 0 : isOverflow ? maxTiles - 1 : count
  if (count > 1 && visibleUsers < 2) visibleUsers = 1
  const overflow = showOnlyOverflow ? count : isOverflow ? count - visibleUsers : 0

  const renderParticipants = () => (
    <div className="w-full h-full flex flex-wrap gap-2 overflow-hidden justify-center">
      {Array.from({ length: visibleUsers }, (_, i) => (
        <div
          key={i}
          className="flex-1 min-w-[150px] basis-[calc(100%/5-0.5rem)] min-h-[120px] flex items-center justify-center bg-green-100 rounded-md"
        >
          User {i + 1}
        </div>
      ))}
      {isOverflow && (
        <div className="flex-1 min-w-[150px] basis-[calc(100%/5-0.5rem)] min-h-[120px] flex items-center justify-center bg-green-100 rounded-md font-semibold text-green-700">
          +{overflow} more
        </div>
      )}
    </div>
  )

  return (
    <div className="w-full h-screen p-1 gap-2 flex flex-col">
      <div className="flex w-full flex-grow gap-2 overflow-hidden">
        <div className="rounded-2xl p-2 grow flex gap-2 h-full">
          {share && (
            <div className="w-[70%] min-w-[150px] h-full bg-yellow-200 rounded-md flex items-center justify-center text-xl font-bold text-yellow-700">
              Shared Content
            </div>
          )}

          <div
            ref={participantRef}
            className={`${share ? 'w-[30%]' : side ? 'w-[70%]' : 'w-full'} h-full`}
          >
            {renderParticipants()}
          </div>

          {side && (
            <div className="w-[30%] min-w-[170px] h-full rounded-md bg-purple-100 p-2 overflow-y-auto">
              <div className="text-lg font-semibold mb-2">Sidebar Panel</div>
              {Array.from({ length: 5 }, (_, i) => (
                <div
                  key={i}
                  className="p-2 border border-purple-300 rounded-md bg-white shadow-sm mb-2"
                >
                  Chat message {i + 1}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="h-[15%] rounded-xl flex items-center justify-between px-4 bg-blue-100">
        <div className="text-lg font-semibold">Footer / Controls</div>
        <div className="flex gap-4">
          <button
            onClick={() => setShare((prev) => !prev)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
          >
            Toggle Share
          </button>
          <button
            onClick={() => setSide((prev) => !prev)}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
          >
            Toggle Sidebar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConferenceTry
