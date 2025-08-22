export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce"></div>
        <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce [animation-delay:-0.5s]"></div>
      </div>
    </div>
  );
}