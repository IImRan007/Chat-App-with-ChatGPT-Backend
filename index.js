const express = require("express");
const connectDb = require("./db/connect");
require("dotenv").config();
require("colors");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const PORT = process.env.PORT || 8000;

const app = express();

connectDb();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api/conversation", require("./routes/conversationRoutes"));

app.get("/", (_, res) => {
  res.status(200).json({ message: "Chat Assistant API" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is Running on Port:", PORT.blue);
});
