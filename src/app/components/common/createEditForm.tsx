"use client";

import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IFormInput {
  title: string;
  releaseDate: string;
  file: FileList;
}

export default function App() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<IFormInput>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit: SubmitHandler<IFormInput> = async data => {
    const file = data.file[0];
    console.log(file, "file")
    // if (!file) {
    //   setError("file", {
    //     type: "manual",
    //     message: "Please upload a valid image file."
    //   });
    //   return;
    // }

    console.log(data);
    const formData = new FormData();
    formData.append("movieTitle", data.title);
    formData.append("publishingYear", data.releaseDate);
    // formData.append("image", file);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/movie",
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
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("File type:", file?.type);  // Debugging line to check the file type
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setError("file", { type: "manual", message: "" });  // Clear previous errors
    } else {
      setSelectedImage(null);
      setError("file", {
        type: "manual",
        message: "Please upload a valid image file."
      });
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
              )}
              <p className="mb-2 text-sm text-white font-normal">
                Drop an image here or click to upload
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
              className="hidden"
              {...register("file")}
              onChange={handleFileChange}
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
              {...register("releaseDate", {
                required: "Release date is required",
                pattern: {
                  value: /^(19|20)\d{2}$/,
                  message: "Enter a valid year (e.g., 1990, 2024)"
                },
                validate: value => parseInt(value) <= currentYear || "Year must be current or past"
              })}
              placeholder="Release Date"
              className={`bg-[#224957] rounded-[10px] px-4 py-2.5 text-sm text-white font-normal leading-6 ${errors.releaseDate ? "border-red-500" : ""}`}
            />
            {errors.releaseDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.releaseDate.message}
              </p>
            )}
          </div>
          <div className="inline-flex gap-4">
            <button
              type="button"
              className="border border-[#FFFFFF] rounded-[10px] py-[15px] px-14 text-base font-bold leading-6 text-white w-full min-w-[167px]"
            >
              Cancel
            </button>
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
}
