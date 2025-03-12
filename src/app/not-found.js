'use client';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';

function ErrorPages() {
  const router = useRouter();

  const buttonHandler = () => {
    router.push('/');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Header />
      <div className="h-[85vh] min-w-screen flex flex-col items-center md:px-4 px-auto mx-auto ">
        <div className="flex flex-col items-center my-auto">
          <h1 className="md:text-3xl text-center">
            Whoa, did you accidentally make a typo or something? 🤔
          </h1>
          <div className=" flex items-center  justify-center py-3 md:py-6 text-black z-20">
            {' '}
            <button
              className="rounded-3xl  border-2 md:px-6 md:py-4 px-4 py-2 md:text-xl text-sm transition-all  hover:bg-blue-500 hover:text-white bg-opacity-100"
              onClick={buttonHandler}
            >
              Bring me back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPages;
