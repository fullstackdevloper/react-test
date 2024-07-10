"use client"

import { useEffect, useState } from 'react';
import Image from "next/image";
import ShapeBackground from "../components/common/backgroundShape";
import Link from "next/link";
import PrimaryButton from '../components/common/primaryBtn';
import MoviesList from '../components/movies';
import axios from 'axios'; // Import Axios

interface Movie {
  _id: string;
  image: string;
  movieTitle: string;
  publishingYear: number;
}

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
console.log("movies :" ,movies)
  useEffect(() => {
    async function fetchMovies() {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get('http://localhost:3000/api/movie', {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`, 
          },
        });

        const { data } = response;
      
        console.log("data : " , data)
        if (data ) {
          console.log("movies 2 :" ,movies)
          setMovies(data.data);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }  
    }

    fetchMovies();
  }, []);


  const handleLogout = () => {
    localStorage.setItem("token","");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#093545]">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  if (movies.length === 0) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between bg-[#093545]">
        <div className="flex items-center flex-col m-auto lg:p-0 px-6">
          <h1 className="lg:text-[48px] text-[32px] font-semibold lg:leading-[56px] leading-[40px] text-white mb-10 text-center">
            Your movie list is empty
          </h1>
          <Link href="/create-movie">
            <PrimaryButton title="Add a new movie" />
          </Link>
        </div>
        <div className="absolute bottom-0 z-0">
          <ShapeBackground />
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#093545]">
      <div className="max-w-screen-xl mx-auto lg:pb-[120px] pb-24 lg:px-0 px-6">
        <div className="flex justify-between items-center lg:py-[120px] py-20">
          <div className="flex items-center z-[1] gap-3">
            <h2 className="lg:text-[48px] text-[32px] font-semibold lg:leading-[56px] leading-[40px] text-white">
              My movies
            </h2>
            <Link href="/create-movie">
              <Image
                src="./images/add-plus-icon.svg"
                alt="add-plus-icon"
                width={32}
                height={32}
              />
            </Link>
          </div>
          <button className="text-base text-white font-bold leading-6 flex justify-between items-center gap-3" onClick={handleLogout}>
            <span className="lg:block hidden">Logout </span>
            <Image
              src="./images/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
          </button>
        </div>
        <MoviesList movies={movies} />
      </div>
      <div className="">
        <ShapeBackground />
      </div>
    </main>
  );
};

export default MovieList;
