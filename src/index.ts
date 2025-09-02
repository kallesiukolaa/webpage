import express, { Request, Response } from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

/*
// Root endpoint -> prints "hello world"
app.get("/", (req: Request, res: Response) => {
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  console.log("The new request from IP " + ip)
  console.log("Using the browser " + req.headers['x-forwarded-for'] || "No browser detected.")
  res.send("Hello world!");
});
*/

// Serve static assets from /public (index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, "../public"), {
  extensions: ["html"], // allows hitting / to serve index.html
}));

// Healthcheck -> 200 OK
app.get("/healthcheck", (_req: Request, res: Response) => {
  res.sendStatus(200);
});

// SPA/HTML fallback (for any unmatched route, serve index.html)
app.get("/", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Technarion site running at http://localhost:${PORT}`);
});