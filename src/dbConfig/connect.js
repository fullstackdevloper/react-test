const mongoose = require("mongoose");

/**
 * Connects to a MongoDB database using Mongoose.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} - Resolves when the connection is established, rejects on error.
 *
 * @example
 * ```javascript
 * await connect();
 * ```
 *
 * @throws Will throw an error if the connection fails.
 *
 * @see {@link https://mongoosejs.com/docs/api.html#mongoose_Mongoose-connect|Mongoose connect}
 *
 * @requires mongoose
 * @requires process.env.MONGO_URI
 */
export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;
    connection.on("connected", () => console.log("Mongodb CONNECTED"));
  } catch (error) {
    console.log("DB Error ", error.message);
  }
}
