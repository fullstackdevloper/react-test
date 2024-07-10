
import jwt from "jsonwebtoken";
import User from "@/models/usersModel";
import { NextResponse } from "next/server";

const jwtSecretKey = process.env.ACCESS_TOKEN_SECRET;

if (!jwtSecretKey) {
  throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables.");
}

const verifyToken = (handler) => {
  return async (req) => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader) {
        return NextResponse.json({ statusCode: 401, status: false, message: "Token must be present" }, { status: 401 });
      }

      const token = authHeader.split(" ")[1];

      if (!token) {
        return NextResponse.json({ statusCode: 401, status: false, message: "Token must be present" }, { status: 401 });
      }

      const decodedToken = jwt.verify(token, jwtSecretKey);
     
      if (!decodedToken) {
        return NextResponse.json({ statusCode: 401, status: false, message: "Invalid token" }, { status: 401 });
      }

      const userInfo = {
        id: decodedToken.id
      };

      const checkUser = await User.findOne({ _id: userInfo.id , token:token})

      if (!checkUser) {
        return NextResponse.json({ statusCode: 401, status: false, message:"User not authenticated. Please log in again." }, { status: 401 });
      }

      const url = new URL(req.url);
      const params = { id: url.pathname.split('/').pop() };
      if (params) {
        return handler(req, userInfo, params);
      }

      return handler(req, userInfo);

    } catch (error) {

      return NextResponse.json({ statusCode: 500, status: false, message: error.message }, { status: 500 });
    }
  };
};

export default verifyToken;