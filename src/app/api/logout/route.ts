import connect from "@/dbConfig/connect";
import User from "@/models/usersModel";
import {NextRequest, NextResponse} from "next/server";
import jwt from "jsonwebtoken";
import {
  successResponseWithMessage,
  badRequest,
  serverError,
} from "@/helpers/apiResponses";
import verifyAuth from "@/middleware/verifyToken";

connect();

/**
 * Handles the POST request for user logout.
 *
 * @param request - The incoming NextRequest object containing the user's token.
 * @returns - A NextResponse object with the appropriate status code and message.
 *
 * @throws Will throw an error if there is an issue with the database connection or token verification.
 */
async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return badRequest(NextResponse, "Token is required");
    }

    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
      userId = (decoded as any).id;
    } catch (error: any) {
      return badRequest(NextResponse, "Invalid or expired token");
    }

    const user = await User.findById(userId);

    if (!user) {
      return badRequest(NextResponse, "User not found");
    }

    await User.findByIdAndUpdate(userId, {token: null});

    return NextResponse.json(
      {
        statusCode: 200,
        status: true,
        message: "logout success",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return serverError(NextResponse, error.message);
  }
}

module.exports = {
  POST: verifyAuth(POST),
};
