import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Movie {
  _id: string;
  image: string;
  movieTitle: string;
  publishingYear: number;
}

interface MoviesListProps {
  movies: Movie[];
}

const MoviesList: React.FC<MoviesListProps> = ({ movies }) => {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 gap-6">
      {movies.map(movie => (
        <Link href={`/edit-movie?id=${movie._id}`} key={movie._id} prefetch>
          <div className="bg-[#092C39] rounded-2xl lg:p-2 cursor-pointer">
            <Image
              src={movie.image || "/images/placeholder.png"}
              alt={movie.movieTitle}
              width={500}
              height={400}
              sizes="100vw"
              className="lg:mb-4 w-full h-auto lg:min-h-[400px] object-cover lg:rounded-2xl rounded-t-xl"
            />
            <div className="lg:px-2 p-3">
              <h3 className="lg:text-xl text-base font-medium lg:leading-8 leading-6 text-white mb-4">
                {movie.movieTitle}
              </h3>
              <p className="text-sm font-normal leading-6 text-white">
                {movie.publishingYear}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MoviesList;
