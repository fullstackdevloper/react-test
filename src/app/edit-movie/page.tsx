"use client";
import { useEffect, useState, useCallback } from "react";
import ShapeBackground from "../components/common/backgroundShape";
import EditMoviesForm from "../components/editmoviesForm";
import { useRouter } from "next/navigation";

export default function UpdateMovie() {
  const router = useRouter();
  const [movieId, setMovieId] = useState<string | null>(null);

  const checkAuthAndRedirect = useCallback(() => {
    let token;
    if (typeof window !== 'undefined') {
       token = localStorage.getItem("token")
    }
   
    if (!token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    checkAuthAndRedirect();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    setMovieId(id);
  }, [checkAuthAndRedirect]);

  if (!movieId) {
    return <div>Loading...</div>;
  }

  return (
    <main className="bg-[#093545]">
      <div className="max-w-screen-xl mx-auto lg:pb-[120px] pb-20 lg:px-0 px-6">
        <div className="lg:py-[120px] py-20">
          <h2 className="lg:text-[48px] text-[32px] font-semibold lg:leading-[56px] leading-[40px] text-white text-left">
            Update a movie
          </h2>
        </div>
        <EditMoviesForm movieId={movieId} />
      </div>
      <div>
        <ShapeBackground />
      </div>
    </main>
  );
}
