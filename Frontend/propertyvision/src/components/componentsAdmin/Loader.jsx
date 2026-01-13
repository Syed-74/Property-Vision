import React from 'react'

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fafafa]">
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#9c4a1a] animate-dot" />
        <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#9c4a1a] animate-dot animation-delay-200" />
        <span className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#9c4a1a] animate-dot animation-delay-400" />
      </div>
    </div>
  )
}

export default Loader