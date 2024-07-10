import Image from "next/image";

import { Metadata } from "next";
import ShapeBackground from "./components/common/backgroundShape";
import SignIn from "./auth/signin/page";

export const metadata: Metadata = {
  title: "Signin"
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#093545]">
      <div className="flex items-center flex-col lg:m-auto my-auto lg:p-0 px-6 z-[1] lg:w-auto w-full">
        <h1 className="lg:text-[64px] text-[48px] font-semibold lg:leading-[80px] leading-[56px] text-white mb-10">
          Sign In
        </h1>
        <SignIn />
      </div>
      <div className="absolute bottom-0 z-0">       
        <ShapeBackground />
      </div>
    </main>
  );
}
