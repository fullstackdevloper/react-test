"use client";

import ShapeBackground from "./components/common/backgroundShape";
import SignIn from "./auth/signin/page";
import MoviesList from "./movies-list/page";
import { useState } from "react";

export default function Home() {
  const [isAuthExists, setIsAuth] = useState(localStorage.getItem("token"));

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#093545]">
      <div className="flex items-center flex-col lg:m-auto my-auto lg:p-0 px-6 z-[1] lg:w-auto w-full">
      {!isAuthExists ? (
        <>
        <h1 className="lg:text-[64px] text-[48px] font-semibold lg:leading-[80px] leading-[56px] text-white mb-10">
          Sign In
        </h1>
        <SignIn />
        </>
        ) : <MoviesList />}
        
       
      </div>
      <div className="absolute bottom-0 z-0">
        <ShapeBackground />
      </div>
    </main>
  );
}
