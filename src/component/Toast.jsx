// --- NEW: Reusable Toast Component ---
const Toast = ({ message, show, type = 'success' }) => {
  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      className={`
        fixed top-5 left-1/2 -translate-x-1/2 z-50
        transform transition-all duration-300 ease-out
        ${bgColor} text-white font-semibold py-2 px-5 rounded-md shadow-xl
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
      `}
    >
      <span>{type === 'success' ? '✔' : '✖'}</span> {message}
    </div>
  );
};