import { CiMenuBurger } from "react-icons/ci";
import { Link } from "react-router-dom";

const Header = () => {
  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.remove("hidden");
    } else {
      mobileMenu.classList.add("hidden");
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 lg:px-20 z-50">
      <h1
        data-aos="fade-down"
        data-aos-easing="linear"
        data-aos-duration="1500"
        className="text-3xl md:text-4xl lg:text-5xl font-light m-0"
      >
        Space
      </h1>
      <nav className="hidden md:flex items-center gap-12">
        <a
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1000"
          className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
          href=""
        >
          COMPANY
        </a>
        <a
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="1500"
          className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
          href=""
        >
          RESOURCE
        </a>
        <a
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="2000"
          className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
          href=""
        >
          FEATURE
        </a>
        <a
          data-aos="fade-down"
          data-aos-easing="linear"
          data-aos-duration="2500"
          className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
          href=""
        >
          DOCS
        </a>
      </nav>

      {/* FIX: Added z-50 to the Link component */}
      <Link to="/login" className="z-50">
        <button
          className="hidden md:block cursor-pointer bg-[#a7a7a7] text-black py-3 px-8 rounded-full font-medium transition-all
          duration-500 hover:bg-white "
        >
          SIGN UP
        </button>
      </Link>

      <button
        className="md:hidden text-3xl p-2 z-50"
        onClick={toggleMobileMenu}
      >
        <CiMenuBurger />
      </button>

      <div
        id="mobileMenu"
        className="hidden fixed top-16 bottom-0 right-0 left-0 p-5 md:hidden z-40 bg-black bg-opacity-70"
      >
        <nav className="flex flex-col gap-6 items-center">
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href=""
          >
            COMPANY
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href=""
          >
            RESOURCE
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href=""
          >
            FEATURE
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50"
            href=""
          >
            DOCS
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;