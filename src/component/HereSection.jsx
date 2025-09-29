import { MdOutlineDiamond } from "react-icons/md";
import Spline from "@splinetool/react-spline";
import { Link } from "react-router-dom";
const HereSection = () => {
  return (
    <main className="flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)]">
      <div
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
        className="max-w-xl ml-[5%] mt-[90%] md:mt-[60%] lg:mt-0"
      >
        <div
          className="relative w-[95%] sm:w-48 h-10
          bg-gradient-to-r from-[#656566] to-[#e99b63]
          shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full"
        >
          <div
            className="absolute inset-[3px]
            bg-black rounded-full flex items-center justify-center gap-1"
          >
            <MdOutlineDiamond />
            Introducing
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8">
          Space-Your personal <br />
          Orbit of Connection
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg tracking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem]">
          Your private corner to match, message, and share moments seamlessly.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <a
            className="border border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-5 rounded-full bg-purple-500 transition-colors-2
              sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]"
            href="#"
          >
            Know More <i className="bx bx-link-external"></i>
          </a>
          <Link
            className="border border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-5 rounded-full 
              sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 bg-gray-300 hover:bg-[#1a1a1a]  text-black hover:text-white "
            to="/login"
          >
            Get Started <i className="bx bx-link-external"></i>
          </Link>
        </div>
      </div>
      {/* 3d robot */}
      <Spline
        data-aos="fade-zoom-in"
        data-aos-easing="ease-in-back"
        data-aos-delay="300"
        data-aos-offset="0"
        data-aos-duration="3000"
        className="absolute lg:top-0 top-[-20%] bottom-0 lg:left-[25%] sm:left-[-2%] h-full "
        scene="https://prod.spline.design/ChIZQOg0lzIjfHG9/scene.splinecode" 
      />
    </main>
  );
};

export default HereSection;
