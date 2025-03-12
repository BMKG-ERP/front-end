'use client';

import Link from 'next/link';

function Header() {
  const buttonHandler = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={`bg-amber-300 flex flex-row w-full p-10 md:mt-5 transition-all md:translate-x-0 translate-x-[-9%] md:translate-y-0 translate-y-[-10%] text-md md:text-xl`}
    >
      <Link
        className={'mx-6 md:ml-5 ml-[8vw] hover:scale-110 hover:opacity-70'}
        href="/"
        onClick={buttonHandler}
      >
        ©Alhaqz
      </Link>
      <div className="flex-1 md:flex mr-5 flex-row items-center justify-end md:show hidden">
        <Link
          className="mx-6 hover:opacity-100 hover:scale-110 opacity-60"
          href="/work"
          onClick={buttonHandler()}
        >
          Work
        </Link>
        <Link
          className="mx-6 hover:opacity-100 hover:scale-110 opacity-60"
          onClick={buttonHandler()}
          href="/about"
        >
          About
        </Link>
        <Link
          className="mx-6 hover:opacity-100 hover:scale-110 opacity-60"
          onClick={buttonHandler()}
          href="/contact"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}

export default Header;
