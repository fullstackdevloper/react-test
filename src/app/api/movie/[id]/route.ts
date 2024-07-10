import {NextRequest, NextResponse} from "next/server";
import connect from "@/dbConfig/connect";
import Movies from "@/models/moviesModel";
import verifyAuth from "@/middleware/verifyToken";
import {
  successResponseWithMessage,
  successResponseWithData,
  badRequest,
  serverError,
} from "@/helpers/apiResponses";
import {handleFileUpdate, handleFileUpload} from "@/helpers/upload";

connect();

/**
 * Handles the PUT request for updating a movie document in the database.
 *
 * @param req - The NextRequest object containing the request data.
 * @param userInfo - The user information obtained from the authentication middleware.
 * @param params - The parameters object containing the movie ID.
 *
 * @returns - A NextResponse object with the updated movie data or an error message.
 *
 * @throws Will throw an error if the movie data is not found or if an error occurs during the update process.
 */
async function PUT(req: NextRequest, userInfo: any, params: {id: string}) {
  try {
    const movieId = params.id;

    let movie = await Movies.findOne({_id: movieId, isDeleted: false});

    if (!movie) {
      return NextResponse.json(
        {
          statusCode: 404,
          status: false,
          message: "Movie data not found",
        },
        {status: 404}
      );
    }

    const formData = await req.formData();
    const title = formData.get("movieTitle") as string;
    const publishingYear = Number(formData.get("publishingYear") as string);
    const image = formData.get("image") as File;
    let dataToSave: any = {};

    if (movie.image) {
      const uploadResult = await handleFileUpdate(image, movie.image);

      const {fileUrl, filename} = uploadResult as {
        fileUrl: string;
        filename: string;
      };

      if (fileUrl) {
        dataToSave.image = fileUrl;
      }
    } else {
      const uploadResult = await handleFileUpload(req, image);

      if (!uploadResult) {
        throw new Error("File upload failed");
      }

      const {fileUrl, filename} = uploadResult;

      dataToSave.image = fileUrl;
    }

    if (title) {
      dataToSave.movieTitle = title;
    }

    if (!isNaN(publishingYear)) {
      dataToSave.publishingYear = publishingYear;
    }

    const updatedMovie = await Movies.findByIdAndUpdate(movieId, dataToSave, {
      new: true,
    });

    return NextResponse.json(
      {data: updatedMovie, message: "Success"},
      {status: 200}
    );
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

/**
 * Handles the GET request for retrieving a single movie document from the database.
 *
 * @param req - The NextRequest object containing the request data.
 * @param userInfo - The user information obtained from the authentication middleware.
 * @param params - The parameters object containing the movie ID.
 *
 * @returns - A NextResponse object with the requested movie data or an error message.
 *
 * @throws Will throw an error if the movie data is not found or if an error occurs during the retrieval process.
 */
async function GET(req: NextRequest, userInfo: any, params: {id: string}) {
  try {
    const {id} = params;
    const criteria = {
      _id: id,
      isDeleted: false,
    };
    const movieById = await Movies.findOne(criteria);

    if (!movieById) {
      return NextResponse.json(
        {statusCode: 404, status: false, message: "Movie not found"},
        {status: 404}
      );
    }

    return NextResponse.json(
      {statusCode: 200, status: true, data: movieById, message: "success"},
      {status: 200}
    );
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

/**
 * Deletes a movie document from the database based on the provided movie ID.
 *
 * @param req - The NextRequest object containing the request data.
 * @param userInfo - The user information obtained from the authentication middleware.
 * @param params - The parameters object containing the movie ID.
 *
 * @returns - A NextResponse object with a success message or an error message.
 *
 * @throws Will throw an error if the movie data is not found or if an error occurs during the deletion process.
 */
async function DELETE(req: NextRequest, userInfo: any, params: {id: string}) {
  try {
    const {id} = params;
    console.log("---params-", params);
    const deletedData = await Movies.findOneAndUpdate(
      {_id: id},
      {isDeleted: true},
      {new: true}
    );
    if (!deletedData) {
      return NextResponse.json({error: "Movie not found"}, {status: 404});
    }
    return NextResponse.json(
      {statusCode: 200, message: "success", data: null},
      {status: 200}
    );
  } catch (error: any) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

module.exports = {
  PUT: verifyAuth(PUT),
  GET: verifyAuth(GET),
  DELETE: verifyAuth(DELETE),
};
