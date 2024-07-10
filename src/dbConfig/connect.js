const mongoose = require("mongoose");

export default async function connect() {
  try {
    console.log("Connect",process.env.MONGO_URI)
    let connect = await mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;
    

    connection.on("connected", () => console.log("Mongodb CONNECTED"));
  } catch (error) {
    console.log("DB Error ", error.message);
  }
}
