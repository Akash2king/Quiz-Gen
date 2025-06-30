# Quiz-Gen

This is an AI-powered quiz generator built with Next.js, Genkit, and ShadCN UI.

## Setup

Before you can run the application, you need to set up your environment variables. The project uses Google's Gemini models for AI functionality, which requires an API key.

1.  Create a file named `.env` in the root of the project (if it doesn't already exist).
2.  Add your Google AI API key to this `.env` file:
    ```
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```
3.  You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Running the Application

This application consists of two main parts: the Next.js frontend and the Genkit AI backend services. You'll need to run both concurrently in separate terminal windows.

### Terminal 1: Start the AI Services

In your first terminal, run the following command to start the Genkit development server. The `--watch` flag will automatically restart the server when you make changes to the AI flows.

```bash
npm run genkit:watch
```
You should see output indicating that the Genkit server is running.

### Terminal 2: Start the Web App

In your second terminal, run the command to start the Next.js development server.

```bash
npm run dev
```

### Accessing the App

Once both servers are running, open your browser and navigate to the following URL:

[http://localhost:9002](http://localhost:9002)

You're all set! You can now generate quizzes on any topic.
