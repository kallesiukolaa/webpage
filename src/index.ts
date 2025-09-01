import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Root endpoint -> prints "hello world"
app.get("/", (req: Request, res: Response) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log("The new request from IP " + ip)
  res.send("Hello world!");
});

// Healthcheck endpoint -> returns 200
app.get("/healthcheck", (req: Request, res: Response) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
