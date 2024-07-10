"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ShapeBackground from "../components/common/backgroundShape";
import Link from "next/link";
import PrimaryButton from "../components/common/primaryBtn";
import MoviesList from "../components/movies";
import axios from "axios"; // Import Axios
import { useRouter } from "next/navigation";

interface Movie {
  _id: string;
  image: string;
  movieTitle: string;
  publishingYear: number;
}

type PaginationProps = {currentPage:number;totalPages:number;onPageChange:(page: number) =>void};

const MovieList: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(8);

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/");
    } else {
      fetchMovies(currentPage);
    }
  }, [currentPage]);

  async function fetchMovies(page: number) {
    const token = localStorage.getItem("token");
    const query = `?page=${page}&limit=${limit}`;

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_URL}/api/movie${query}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response;

      if (data) {
        setMovies(data.data);
        setTotalPages(data.totalPages); // Assuming API returns total pages
      } else {
        setMovies([]);
      }
    } catch (error) {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    localStorage.removeItem("token");
    await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/logout`,
      {}, // Body is empty if it's just a logout request
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    router.push("/");
  };

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
                src="/images/add-plus-icon.svg"
                alt="add-plus-icon"
                width={32}
                height={32}
              />
            </Link>
          </div>
          <button
            className="text-base text-white font-bold leading-6 flex justify-between items-center gap-3"
            onClick={handleLogout}
          >
            <span className="lg:block hidden">Logout </span>
            <Image
              src="/images/logout.svg"
              alt="logout"
              width={24}
              height={24}
            />
          </button>
        </div>
        <MoviesList movies={movies} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <div className="">
        <ShapeBackground />
      </div>
    </main>
  );
};

const
  Pagination
    :
    React
    .FC<
      PaginationProps
    > =
    ({ currentPage, totalPages, onPageChange }) => {
      const pages = [];

      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return (
        <div className="flex justify-center lg:mt-[120px] mt-[80px]">
        <button
          className="px-4 py-2 mx-1 text-base font-bold leading-6 text-white"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`px-4 py-2 mx-1 rounded ${
              page === currentPage ? "bg-[#2BD17E] text-base font-bold leading-6 text-white" : "bg-[#092C39] text-base font-bold leading-6 text-white"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="px-4 py-2 mx-1 text-base font-bold leading-6 text-white"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      );
    };

export default MovieList;
