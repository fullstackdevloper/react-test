import {NextRequest, NextResponse} from "next/server";
import connect from "@/dbConfig/connect";
import Movies from "@/models/moviesModel";
import verifyAuth from "@/middleware/verifyToken";
import {handleFileUpload, handleFileUpdate} from "@/helpers/upload";
import { movieSchema, updateMovieSchema } from "@/utils/schemaValidations"
import moment from "moment";
connect();

/**
 * Handles the POST request for creating a new movie record.
 *
 * @remarks
 * This function expects a form-data request containing movie details and an image file.
 * It verifies the user's authentication token, processes the form data, uploads the image file,
 * and saves the movie record in the database.
 *
 * @param req - The Next.js request object containing form-data and headers.
 * @param userInfo - The user's information obtained from the authentication token.
 *
 * @returns - A JSON response with the saved movie data or an error message.
 *
 * @throws Will throw an error if the file upload fails.
 */

async function POST(req: NextRequest, userInfo: any) {
  try {
      const formData = await req.formData();
      console.log("formData : ",formData)
      const title = formData.get("movieTitle") as string;
      const publishingDate = formData.get("publishingYear") as string; 

      if(!title || typeof title !== "string"){
        return NextResponse.json(
          {statusCode: 400, status: false, message: "title is required and must be string"},
          {status: 400}
        );
      }

      
      if (!publishingDate || !moment(publishingDate, 'YYYY-MM-DD', true).isValid()) {
        return NextResponse.json(
          { statusCode: 400, status: false, message: "Publishing date is required and must be in YYYY-MM-DD format" },
          { status: 400 }
        );
      }
  
      const currentDate = moment();
      const inputDate = moment(publishingDate, 'YYYY-MM-DD');
  
      if (!inputDate.isValid() || inputDate.isBefore(currentDate, 'day')) {
        return NextResponse.json(
          { statusCode: 400, status: false, message: "Publishing date must be a valid date and cannot be earlier than the current date" },
          { status: 400 }
        );
      }
  
      const image = formData.get("image") as File;

      if (!image) {
        return NextResponse.json(
          { statusCode: 400, status: false, message: "image is required" },
          { status: 400 }
        );
      }
      const userId = userInfo.id;

      let dataToSave: any = {
          movieTitle: title,
          publishingYear: inputDate.format('YYYY-MM-DD'),
          userId: userId,
      };

      if (image) {
          const uploadResult = await handleFileUpload(req, image);
          // console.log("uploadResult : " + uploadResult)
          if (!uploadResult) {
              throw new Error("File upload failed");
          }

          const { fileUrl, filename } = uploadResult;

          dataToSave.image = fileUrl;
      }

      // Assuming Movies is your database model for movies and has a create method
      const savedData = await Movies.create(dataToSave);

      return NextResponse.json(
          { data: savedData, message: "success" },
          { status: 201 }
      );
  } catch (error: any) {
      console.error("Error in POST:", error);
      return NextResponse.json({ statusCode:400, status:false, message: error.message }, { status: 400 });
  }
}

/**
 * Handles the PUT request for updating an existing movie record.
 *
 * @remarks
 * This function expects a JSON request containing updated movie details.
 * It verifies the user's authentication token, fetches the movie record by its ID,
 * updates the record with the provided data, and returns the updated record.
 *
 * @param req - The Next.js request object containing JSON data and headers.
 * @param params - The request parameters containing the movie ID.
 * @param params.id - The ID of the movie record to be updated.
 *
 * @returns - A JSON response with the updated movie data or an error message.
 *
 * @throws Will throw an error if the movie record cannot be found or updated.
 */
async function PUT(req: NextRequest, {params}: {params: {id: string}}) {
  try {
    const data = await req.json();
    console.log("---data-", data);
    const {id} = params;
    const updatedData = await Movies.findOneAndUpdate({_id: id}, data, {
      new: true,
    });
    return NextResponse.json(
      {data: updatedData, message: "success"},
      {status: 200}
    );
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json({error: error.message}, {status: 500});
  }
}

/**
 * Handles the GET request for retrieving movie records.
 *
 * @remarks
 * This function fetches all movie records from the database that are not marked as deleted.
 * It populates the `userId` field with the `_id` and `email` fields from the user's collection.
 *
 * @param req - The Next.js request object.
 *
 * @returns - A JSON response with the following properties:
 * - statusCode: 200
 * - status: true
 * - data: An array of movie records.
 * - message: "success"
 *
 * @throws Will throw an error if there is an issue with fetching the movie records.
 */
async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || searchParams.get("limt") || "6", 10);

    const criteria = {
      isDeleted: false,
    };

    const totalRecords = await Movies.countDocuments(criteria);
    const totalPages = Math.ceil(totalRecords / limit);
    const skip = (page - 1) * limit;

    const savedData = await Movies.find(criteria)
      .populate("userId", "_id email")
      .skip(skip)
      .sort({ updatedAt: -1 })
      .limit(limit);

    return NextResponse.json(
      {
        statusCode: 200,
        status: true,
        data: savedData,
        message: "success",
        currentPage: page,
        totalPages: totalPages,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

module.exports = {
  POST: verifyAuth(POST),
  PUT: verifyAuth(PUT),
  GET: verifyAuth(GET),
};
