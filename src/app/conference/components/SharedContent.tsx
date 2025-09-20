export default function SharedContent({ visible }: { visible: boolean }) {
  return (
    <div
      className={`transition-all duration-500 ease-in-out ${
        visible ? 'opacity-100 w-[70%] min-w-[150px]' : 'opacity-0 w-0 pointer-events-none'
      } h-full bg-yellow-200 rounded-md flex items-center justify-center text-xl font-bold text-yellow-700`}
    >
      Shared Content
    </div>
  )
}