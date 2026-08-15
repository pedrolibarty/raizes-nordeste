import express from "express";

export const app = express();

app.use(express.json());

app.get("/health", (request, response) => {
  return response.status(200).json({
    status: "ok",
    message: "API is running.",
  });
});