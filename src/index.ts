import express, { Request, Response } from "express";
import path from "path";
import rateLimit from 'express-rate-limit';
import {SQS} from 'aws-sdk'

const app = express();
const PORT = process.env.PORT || 3000;

app.enable('trust proxy')

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

const limiter = rateLimit({ windowMs: 60 * 1000, max: 20 });
app.use('/api/contact', limiter);

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message, userAgent, page } = req.body || {};
  if(!firstName || !lastName || !email || !message){
    console.log(JSON.stringify(req.body))
  return res.status(400).send('Missing required fields.');
  }

  const sqs = new SQS()


  // Example: enqueue to SNS/SQS, or send an email via SES here
   await sqs.sendMessage({
    MessageBody: req.body.message,
    QueueUrl: process.env.QUEUE_URL ?? '',
    MessageAttributes: {
      FirstName: {
        DataType: "String",
        StringValue: req.body.firstName
      },
      LastName: {
        DataType: "String",
        StringValue: req.body.lastName
      },
      Email: {
        DataType: "String",
        StringValue: req.body.email
      },
      Phone: {
        DataType: "String",
        StringValue: req.body.phone
      },
      UserAgent: {
        DataType: "String",
        StringValue: req.body.userAgent
      }
    }
   })


  return res.status(202).send('Accepted');
});

app.listen(PORT, () => {
  console.log(`Technarion site running at http://localhost:${PORT}`);
});