export const CustomButton = ({ children, ...props }) => (
  <button
    className="relative cursor-pointer py-3 px-6 text-center font-barlow inline-flex justify-center text-sm uppercase text-white rounded-lg border-solid transition-all duration-300 ease-in-out group overflow-hidden bg-[#2c1857]/60 hover:bg-[#2c1857]/80 focus:bg-[#2c1857]/80 focus:ring-4 focus:ring-white/50"
    {...props}
  >
    <span className="relative z-20">{children}</span>
    <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/10 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out" />
  </button>
);