<div align="center">
  <img src="https://storage.googleapis.com/hume-public-logos/hume/hume-banner.png">
  <h1>Empathic Voice Interface | Next.js App Router with Chat History</h1>
</div>

![preview.png](preview.png)

## Overview

This project features an enhanced implementation of Hume's [Empathic Voice Interface](https://dev.hume.ai/docs/empathic-voice-interface-evi/overview) using Hume's [React SDK](https://github.com/HumeAI/empathic-voice-api-js/tree/main/packages/react). Built with Next.js App Router, it includes both real-time voice interaction and chat history features with emotion analysis.

### Key Features

- 🎙️ Real-time voice interaction with EVI
- 📊 Emotion analysis for user interactions
- 💬 Chat history with emotion tracking
- 🎨 Modern UI with dark/light mode support
- 📱 Responsive design
- 🔍 Historical conversation browsing
- 📈 Emotion trend analysis per conversation

See the [Quickstart guide](https://dev.hume.ai/docs/empathic-voice-interface-evi/quickstart/nextjs) for a detailed explanation of the base EVI implementation.

## Project deployment

Click the button below to deploy this example project with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhumeai%2Fhume-evi-next-js-starter&env=HUME_API_KEY,HUME_CLIENT_SECRET)

Below are the steps to completing deployment:

1. Create a Git Repository for your project.
2. Provide the required environment variables. To get your API key and Secret key, log into the Hume AI Platform and visit the [API keys page](https://platform.hume.ai/settings/keys).

## Local Development

1. Clone this examples repository:

   ```shell
   git clone https://github.com/humeai/hume-api-examples
   cd hume-api-examples/evi/evi-next-js-app-router-quickstart
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

3. Set up your API key and Secret key:

   In order to make an authenticated connection we will first need to generate an access token. Doing so will require your API key and Secret key. These keys can be obtained by logging into the Hume AI Platform and visiting the [API keys page](https://platform.hume.ai/settings/keys). For detailed instructions, see our documentation on [getting your api keys](https://dev.hume.ai/docs/introduction/api-key).

   Place your `HUME_API_KEY` and `HUME_SECRET_KEY` in a `.env` file at the root of your project.

   ```shell
   echo "HUME_API_KEY=your_api_key_here" > .env
   echo "HUME_SECRET_KEY=your_secret_key_here" >> .env
   ```

   You can copy the `.env.example` file to use as a template.

4. Specify an EVI configuration (Optional):

   EVI is pre-configured with a set of default values, which are automatically applied if you do not specify a configuration. The default configuration includes a preset voice and language model, but does not include a system prompt or tools. To customize these options, you will need to create and specify your own EVI configuration. To learn more, see our [configuration guide](https://dev.hume.ai/docs/empathic-voice-interface-evi/configuration/build-a-configuration).

   You may pass in a configuration ID to the `VoiceProvider` object inside the [components/Chat.tsx file](https://github.com/HumeAI/hume-api-examples/blob/main/evi/next-js/evi-next-js-app-router-quickstart/components/Chat.tsx).

   Here's an example:

   ```tsx
   <VoiceProvider
     configId="YOUR_CONFIG_ID"
     auth={{ type: "accessToken", value: accessToken }}
   >
   ```

5. Run the project:
   ```shell
   npm run dev
   ```

## Features Guide

### Chat History

The application includes a comprehensive chat history feature that allows you to:

- View past conversations in a side panel
- See detailed emotion analysis for each user message
- Track emotion trends across conversations
- View timestamps for each message
- Navigate between different chat sessions

### Emotion Analysis

Each user message in the chat history includes:

- Top 3 detected emotions with scores
- Visual indicators for emotion intensity
- Overall emotion trends for the entire conversation

### UI/UX Features

- Responsive chat interface
- Dark/light mode support
- Real-time voice visualization
- Message bubbles with clear user/assistant distinction
- Easy navigation between live chat and history

## Technologies Used

- Next.js 14 with App Router
- React 18
- TailwindCSS for styling
- Hume AI Voice SDK
- Framer Motion for animations
- TypeScript for type safety

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
