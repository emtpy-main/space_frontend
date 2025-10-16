import React, { useState, useRef, useEffect, useCallback } from 'react';

// A placeholder component for the video elements.
// In a real app, you would pass the ref to the actual <video> tag.
const VideoPlaceholder = ({ children }) => (
  <div className="flex h-full w-full items-center justify-center bg-slate-800/50">
    <span className="text-slate-500">{children}</span>
  </div>
);

const VideoCallUI = ({ remoteEmailId, myVideoRef, remoteVideoRef }) => {
  const localVideoRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const dx = clientX - dragStartRef.current.startX;
    const dy = clientY - dragStartRef.current.startY;
    setPosition({
      x: dragStartRef.current.initialX + dx,
      y: dragStartRef.current.initialY + dy,
    });
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  return (
    // Main container is now a canvas for the video elements
    <div className="relative h-screen w-screen overflow-hidden bg-slate-900 font-sans text-white">
      
      {/* Remote Video Panel: Full screen on mobile, 80% on larger screens */}
      <div className="absolute inset-0 flex h-full w-full items-center justify-center sm:p-4 lg:p-8">
        <div className="relative h-full w-full overflow-hidden bg-black shadow-2xl sm:max-h-[80vh] sm:max-w-[80vw] sm:rounded-2xl">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
            {/* <VideoPlaceholder>Remote User's Camera</VideoPlaceholder> */}
            <h2 className="absolute bottom-3 left-4 text-xl font-bold text-slate-300">Remote Video</h2>
        </div>
      </div>

      {/* Connection Status Indicator */}
      <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2 transform rounded-full bg-black/30 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm">
        <p>You are connected to <span className="font-semibold text-white">{remoteEmailId || '...'}</span></p>
      </div>

      {/* My Video Panel (Draggable) */}
      <div
        ref={localVideoRef}
        className="absolute bottom-5 right-5 z-10 w-48 cursor-move touch-none overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 md:w-64"
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div className="aspect-video w-full">
            <video
              ref={myVideoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          {/* <VideoPlaceholder>Your Camera</VideoPlaceholder> */}
        </div>
        <h2 className="absolute top-1 left-2 text-sm font-bold text-slate-300 opacity-80">My Video</h2>
      </div>

      {/* End Call Button */}
      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform">
        <button 
          className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition-all hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-900 active:scale-95"
          aria-label="End Call"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.654 6.654a1 1 0 0 0-1.414 1.414L5.354 11H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h.354l-3.11 3.11a1 1 0 1 0 1.414 1.414L20.346 3.654a1 1 0 0 0-1.414-1.414L3.654 6.654zm16.707 15.707a1 1 0 0 0 1.414-1.414L5.067 4.24A15.93 15.93 0 0 0 3.32 10.995c.571 3.92 2.898 7.378 6.182 9.498 3.565 2.301 7.842 2.456 11.579.431l-.37.37zM20.68 13.005c-.57-3.92-2.898-7.378-6.182-9.498-3.565-2.3-7.842-2.456-11.579-.43l16.76 16.76c.7-1.12.98-2.4.9-3.722a16.03 16.03 0 0 0-2.3-5.22z"/>
          </svg>
        </button>
      </div>

    </div>
  );
};

// You can use this component in your app like this:
// export default function App() {
//   const myVideoRef = React.useRef(null);
//   const remoteVideoRef = React.useRef(null);
//
//   return (
//     <VideoCallUI 
//       remoteEmailId="user@example.com" 
//       myVideoRef={myVideoRef}
//       remoteVideoRef={remoteVideoRef}
//     />
//   );
// }

export default VideoCallUI;

