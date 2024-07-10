import connect from "@/dbConfig/connect";
import User from "@/models/usersModel";
import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  successResponseWithMessage,
  successResponseWithData,
  badRequest,
  serverError,
} from "@/helpers/apiResponses";

connect();

/**
 * Handles the POST request for user login.
 *
 * @param request - The incoming NextRequest object containing the user's login credentials.
 * @returns - A NextResponse object with the appropriate status code, message, and token (if successful).
 *
 * @throws Will throw an error if the email or password is missing or invalid.
 * @throws Will throw an error if the user does not exist or the password is incorrect.
 * @throws Will throw an error if there is an issue with the database connection or token generation.
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const {email, password} = reqBody;

    if (!email) {
      return badRequest(NextResponse, "email is required and must be a string");
    }

    if (!password) {
      return badRequest(
        NextResponse,
        "password is required and must be a string"
      );
    }

    const user = await User.findOne({email});

    if (!user) {
      return badRequest(NextResponse, "User does not exist ");
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return badRequest(NextResponse, "Invalid password");
    }

    //create token data
    const tokenData = {id: user._id};
    //create token
    let token = await jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    await User.findByIdAndUpdate(user._id, {token: token});

    const response = NextResponse.json({
      statusCode: 200,
      message: "Login successful",
      success: true,
      token,
    });

    return response;
  } catch (error: any) {
    return serverError(NextResponse, error.message);
  }
}
