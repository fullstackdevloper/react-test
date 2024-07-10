"use client";

import axios from "axios";
import { useForm, SubmitHandler, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

interface IFormInput {
  title: string;
  releaseDate: string;
  file: FileList;
}

interface Movie {
  _id: string;
  image: string;
  movieTitle: string;
  publishingYear: number;
}

interface EditMoviesFormProps {
  movieId: string;
}
const token = localStorage.getItem("token");

const EditMoviesForm: React.FC<EditMoviesFormProps> = ({ movieId }) => {
  const { register, handleSubmit, formState: { errors }, setError, control, setValue } = useForm<IFormInput>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Watch the file input for changes
  const file = useWatch({
    control,
    name: "file",
  });

  useEffect(() => {
    if (file && file.length > 0) {
      const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg",];
      if (!acceptedTypes.includes(file[0].type)) {
        setError("file", {
          type: "manual",
          message: "Only images (jpg, jpeg, png, gif) are allowed."
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file[0]);
      setSelectedImage(imageUrl);
    }
  }, [file, setError]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/movie/${movieId}`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        });
        const movieData = response?.data.data;
        setMovie(movieData);

        // Set form values with fetched data
        setValue("title", movieData.movieTitle);
        setValue("releaseDate", new Date(movieData.publishingYear).toISOString().split('T')[0]);
        setSelectedImage(movieData.image);

      } catch (error) {
        setErrorMessage("Failed to fetch movie data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId, setValue]);

  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    console.log("Form data:", data);

    const file = data.file[0];

    const formData = new FormData();
    formData.append("movieTitle", data.title);
    formData.append("publishingYear", data.releaseDate);
    formData.append("image", file);

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_URL}/api/movie/${movieId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log(response.data);
      router.push("/movies-list");
    } catch (error: any) {
      setErrorMessage(error?.response?.data?.message ?? error?.response?.data?.error);
      console.error("Error uploading file:", error);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="lg:grid grid-cols-2">
        <div>
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full min-w-[473px] max-w-[473px] h-full min-h-[504px] border-2 border-[#fff] border-dashed rounded-lg cursor-pointer bg-[#224957]"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {selectedImage ? (
                <img src={selectedImage} alt="Selected" className="mb-4 max-h-[200px]" />
              ) : (
                <>
                  <svg
                    className="w-8 h-8 mb-4 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-white font-normal">
                    Drop an image here or click to upload
                  </p>
                </>
              )}
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              className="hidden"
              {...register("file")}
            />
          </label>
          {errors.file && (
            <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
          )}
        </div>
        <div>
          <div className="mb-6">
            <input
              {...register("title", { required: "Title is required" })}
              placeholder="Title"
              className="bg-[#224957] rounded-[10px] px-4 py-2.5 text-sm text-white font-normal w-full leading-6 min-w-[362px] max-w-[362px]"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <input
              {...register("releaseDate", { required: "Release date is required" })}
              type="date"
              placeholder="Release Date"
              className={`bg-[#224957] rounded-[10px] px-4 py-2.5 text-sm text-white font-normal leading-6 ${errors.releaseDate ? "border-red-500" : ""}`}
            />
            {errors.releaseDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.releaseDate.message}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 text-sm mt-1">
                {errorMessage}
              </p>
            )}
          </div>
          <div className="inline-flex gap-4">
            <Link href="/movies-list">
              <button
                className="border border-[#FFFFFF] rounded-[10px] py-[15px] px-14 text-base font-bold leading-6 text-white w-full min-w-[167px] flex items-center justify-center"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="bg-[#2BD17E] rounded-[10px] py-[15px] px-14 text-base font-bold leading-6 text-white w-full min-w-[179px]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditMoviesForm;
