import express, { Request, Response } from "express";
import path from "path";
import rateLimit from 'express-rate-limit';
import {SQS} from 'aws-sdk'

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1)

// Add this line to parse JSON payloads
app.use(express.json()); 

// Serve static assets from /public (index.html, style.css, etc.)
app.use(express.static(path.join(__dirname, "../public"), {
  extensions: ["html"], // allows hitting / to serve index.html
}));

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

// index.ts

// ... (your existing imports and app setup) ...

app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, message } = req.body || {};
  if (!firstName || !lastName || !email || !message) {
    // This is already good, returns a non-descriptive error
    return res.status(400).send('Missing required fields.');
  }

  try {
    const sqs = new SQS();
    
    // Check for required AWS environment variables here
    if (!process.env.QUEUE_URL || !process.env.AWS_REGION) {
      console.error('Missing AWS environment variables: QUEUE_URL or AWS_REGION');
      return res.status(500).send('An internal server error occurred.');
    }

    // Example: enqueue to SNS/SQS, or send an email via SES here
    await sqs.sendMessage({
      MessageBody: message,
      QueueUrl: process.env.QUEUE_URL,
      MessageAttributes: {
        FirstName: { DataType: "String", StringValue: firstName },
        LastName: { DataType: "String", StringValue: lastName },
        Email: { DataType: "String", StringValue: email },
        Phone: { DataType: "String", StringValue: req.body.phone },
        UserAgent: { DataType: "String", StringValue: req.body.userAgent },
      }
    }).promise();

    res.sendStatus(200);

  } catch (error) {
    // This is the crucial part:
    // Log the detailed error for yourself (for debugging)
    console.error('Error sending message to SQS:', error);

    // Return a generic error message to the client
    res.status(500).send('An internal server error occurred.');
  }
});

app.listen(PORT, () => {
  console.log(`Technarion site running at http://localhost:${PORT}`);
});