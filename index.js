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
app.use(express.urlencoded({ extended: false }));
const allowedOrigins = [
  "https://chat-app-with-chat-gpt-backend.vercel.app/",
  "http://localhost:9000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);

// Routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/conversation", require("./routes/conversationRoutes"));

app.get("/", (_, res) => {
  res.status(200).json({ message: "Chat Assistant API" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is Running on Port:", PORT.blue);
});
