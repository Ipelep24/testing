interface Props {
  joined: boolean
  micOn: boolean
  camOn: boolean
  onJoin: () => void
  onLeave: () => void
  onToggleMic: () => void
  onToggleCam: () => void
  onToggleSidebar: () => void
  onToggleShare: () => void
  side: boolean
  share: boolean
}

export default function FooterControls({
  joined,
  micOn,
  camOn,
  onJoin,
  onLeave,
  onToggleMic,
  onToggleCam,
  onToggleSidebar,
  onToggleShare,
  side,
  share,
}: Props) {
  return (
    <div className="h-[15%] rounded-xl flex items-center justify-between px-4 bg-blue-100">
      <div className="space-x-2">
        {!joined ? (
          <button onClick={onJoin} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Join
          </button>
        ) : (
          <>
            <button onClick={onToggleMic} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
              {micOn ? 'Mute Mic' : 'Unmute Mic'}
            </button>
            <button onClick={onToggleCam} className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
              {camOn ? 'Turn Off Cam' : 'Turn On Cam'}
            </button>
            <button onClick={onLeave} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
              Leave
            </button>
          </>
        )}
      </div>
      <div className="space-x-2">
        <button onClick={onToggleSidebar} className="px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">
          {side ? 'Hide Sidebar' : 'Show Sidebar'}
        </button>
        <button onClick={onToggleShare} className="px-3 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">
          {share ? 'Stop Sharing' : 'Start Sharing'}
        </button>
      </div>
    </div>
  )
}