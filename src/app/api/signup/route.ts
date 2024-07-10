import connect from "@/dbConfig/connect";
import User from "@/models/usersModel";

import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import {
  successResponseWithMessage,
  successResponseWithData,
  badRequest,
} from "@/helpers/apiResponses";
connect();

/**
 * This function handles the POST request for user registration.
 * It receives a NextRequest object, validates the request body, checks if the user already exists,
 * hashes the password, and saves the new user to the database.
 *
 * @param request - The NextRequest object containing the request body.
 * @returns - A NextResponse object with appropriate status code and JSON payload.
 *
 * @throws Will throw an error if any exception occurs during the process.
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {email, password} = reqBody;

    // Custom validation
    if (email) {
      return NextResponse.json(
        {message: "email is required and must be a string"},
        {status: 400}
      );
    }
    if (password) {
      return NextResponse.json(
        {
          statusCode: 400,
          status: false,
          message: "password is required and must be a string",
        },
        {status: 400}
      );
    }
    console.log(reqBody);

    //check if user already exists
    const user = await User.findOne({email});

    if (user) {
      return NextResponse.json(
        {statusCode: 400, status: false, message: "User already exists"},
        {status: 400}
      );
    }

    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    return successResponseWithData(
      NextResponse,

      true,
      "User  created successfully Res",
      savedUser
    );
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}
