import React, { useState } from "react";
import Image from "next/image";
import EditMoviesForm from "./editmoviesForm";

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
  const [showForm, setShowForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const showEditForm = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowForm(true);
  };

  return (
    <div className="grid lg:grid-cols-4 grid-cols-2 gap-6">
      {movies.map(movie => (
        <div key={movie._id} className="bg-[#092C39] rounded-2xl lg:p-2" onClick={() => showEditForm(movie)}>
          <Image
            src={movie.image || "/images/placeholder.png"}
            alt={movie.movieTitle}
            width={500} height={400} sizes="100vw"
            className="lg:mb-4 w-full h-auto min-h-[400px] object-cover lg:rounded-2xl rounded-t-xl"
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
      ))}
      {showForm && selectedMovie && <EditMoviesForm movie={selectedMovie} onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default MoviesList;
