import express from "express";

const app = express();

app.get("/", (req, res) => {
  return res.json({ message: "My name is Chien" });
});

app.listen("5000", () => {
  console.log("Server on port 5000");
});
