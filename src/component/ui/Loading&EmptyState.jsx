const glassStyle =
  "bg-[#2c1857]/30 border border-white/20 text-white backdrop-blur-lg shadow-2xl rounded-2xl";

export const LoadingState = () => (
  <div className={`flex flex-col justify-center items-center h-[75vh] max-h-[600px] w-full ${glassStyle}`}>
    <span className="loading loading-spinner loading-lg text-primary"></span>
    <p className="mt-4 text-lg">Finding new people...</p>
  </div>
);

export const EmptyState = ({ onRefresh }) => (
  <div className={`text-center p-8 flex flex-col justify-center items-center h-full w-full ${glassStyle}`}>
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h2 className="text-2xl font-bold text-white mt-4">All Caught Up!</h2>
    <p className="text-gray-300 mt-2">There are no new profiles right now. Check back later!</p>
    <button onClick={onRefresh} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-focus transition-transform duration-200 hover:scale-105">
      Refresh
    </button>
  </div>
);
