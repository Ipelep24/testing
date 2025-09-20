export default function SidebarPanel({ visible }: { visible: boolean }) {
  return (
    <div
      className={`h-full rounded-md bg-purple-100 overflow-y-auto transition-all duration-500 ease-in-out ${
        visible
          ? 'opacity-100 translate-x-0 w-[30%] min-w-[170px] pointer-events-auto p-2'
          : 'opacity-0 translate-x-full w-0 pointer-events-none'
      }`}
    >
      <div className="text-lg font-semibold mb-2">Sidebar Panel</div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="p-2 border border-purple-300 rounded-md bg-white shadow-sm mb-2">
          Chat message {i + 1}
        </div>
      ))}
    </div>
  )
}