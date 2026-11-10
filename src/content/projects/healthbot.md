---
title: HealthBot
year: 2024–2025
period: December 2024 – 2025
role: Original Developer & AIHealth Co-founder
status: Launched prototype · Team project
summary: An AI-powered health-information assistant I started in high school and developed further with the AIHealth team, exploring conversational AI, response streaming, image support, and chat history.
tags: React, Vite, Node.js, Express, MongoDB, Gemini, Clerk, ImageKit
links: Source code|https://github.com/AayanWasti/Healthbot-official/tree/446a2915ab2ab62a56843f429c59f2da433a2ce9 ; Oakville News|https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011
order: 1
art: healthbot
hero: /projects/healthbot/dashboard-2025.png
heroAlt: Historical HealthBot dashboard showing the conversation list, account control, and message composer.
heroWidth: 2876
heroHeight: 1610
heroCaption: Historical dashboard. Screenshot supplied by Aayan Wasti to [Oakville News](https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011); full image, uncropped.
---

## Overview

I started HealthBot on my own in high school. It became the main product of AIHealth, the healthcare AI startup I co-founded, and eventually a team effort. The goal was straightforward: make health information easier to access and understand through a conversational assistant.

The initial version was something I could build independently. Improving a product that people were actually using was a different kind of work. We had to pay attention to the experience around the model: whether images reached it, whether an answer finished, and whether the conversation was still there when someone returned.

This write-up looks back at what we built, what went wrong, and what I would approach differently today. The architecture refers to a March 12, 2025 snapshot of our code, so later deployment changes are noted separately.

HealthBot was built to help people understand health information. It does not replace professional medical advice. This write-up documents a software prototype; it does not establish clinical validation, diagnostic accuracy, or that every generated answer was verified against medical sources.

## How it started

The problem I wanted to work on was surprisingly ordinary: you can find a lot of health information online, but understanding it is another matter. Medical terminology can make even a basic explanation difficult to follow. I wanted to build something conversational, where someone could ask a question and follow up when the first answer was confusing.

I started building the first version on my own. As the idea grew into AIHealth, other people joined, and HealthBot became a collaborative project. The product got better through that teamwork. I can speak directly about starting it, but I do not want to take individual credit for every later feature or fix.

In [the March 2025 feature](https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011), the team is credited as: me, co-founder and CEO; Aayan Rahman, CTO; Ivan Jehad, CMO; Brianna Azan, UX/UI designer; and student volunteers.

The architecture below describes the application we worked on, not a list of components I claim to have written individually. I care more about explaining how the system behaved than making the story sound like a solo build.

## Building HealthBot

HealthBot was more than a box that sent a question to a model. The interesting work was everything around the answer: signing in, keeping conversations organized, handling images, showing text as it arrived, and saving the result so a user could return to it.

### A React interface around the conversation

The frontend is a Vite-built React application. React Router defines the public homepage, sign-in and sign-up screens, a dashboard, and individual conversations at `/dashboard/chats/:id`. Clerk supplies the sign-in components and session state. The dashboard layout checks whether authentication has loaded before redirecting someone who is signed out.

TanStack Query handles loading chat history and refreshing cached data after changes. Responses are displayed with `react-markdown`. These pieces make the interface more than a single prompt box: a conversation can be opened, continued, and found again in the sidebar.

Those details are visible in the [March 2025 client](https://github.com/AayanWasti/Healthbot-official/tree/446a2915ab2ab62a56843f429c59f2da433a2ce9/client/src).

### The model request and the application API are separate

One important detail is easy to miss when describing this as a full-stack AI app: the React client calls Gemini directly. In the March snapshot, `client/src/lib/gemini.js` configures `gemini-1.5-flash`. The Express backend stores conversations and provides upload credentials; it is not the proxy that generates the model’s response.

That split makes the request path clear, but it also puts model configuration in the browser. The code uses a `VITE_` environment variable for the Gemini key. In a rebuild, I would move model access behind the server so provider credentials, request limits, and response handling could be controlled there. I would not describe the browser-based arrangement as a security safeguard.

### Keeping a conversation after the response finishes

The Node.js backend uses Express and Mongoose. There are two MongoDB models: `Chat` holds a user ID and a sequence of user/model messages; `UserChats` holds the sidebar’s chat IDs and titles. Image paths can be attached to individual history entries.

The REST API creates a conversation, lists a user’s conversations, retrieves one, appends a question and answer, and deletes a conversation. Chat routes use Clerk authentication, and reads and updates include the authenticated `userId` in their database filters. That ties stored conversations to the signed-in account.

Keeping the sidebar index separate gives it a smaller representation to load. It also creates two records that must stay consistent. Looking at the schema now, I would test creation and deletion across both models, including what happens if only one write succeeds.

### Streaming an answer, then saving it

`NewPrompt.jsx` starts a model chat from the stored history and receives the next response as a stream. A ref accumulates the text while React state updates what the user sees. Once the stream loop finishes, a mutation sends the accumulated answer to the application API.

This excerpt is from the [March 2025 streaming implementation](https://github.com/AayanWasti/Healthbot-official/blob/446a2915ab2ab62a56843f429c59f2da433a2ce9/client/src/components/newPrompt/NewPrompt.jsx#L102-L110), with comments and blank lines omitted:

```jsx title="NewPrompt.jsx · verified excerpt"
answerRef.current = "";
for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  answerRef.current += chunkText;
  setAnswer(answerRef.current);
}
mutation.mutate();
```

The ref matters because the save operation can use the accumulated answer instead of relying on the timing of React state updates. But finishing a stream loop is not necessarily the same as receiving a complete answer. That difference became especially important once users started reporting cut-off responses.

### Two paths for an attached image

An attached image has two jobs in the code. `FileReader` turns it into base64 `inlineData`, including its MIME type, for the Gemini request. Separately, ImageKit uploads the file and returns the path used to display it in the conversation later. The Express `/api/upload` endpoint supplies ImageKit authentication parameters.

Those paths are related, but their results are different. An upload can produce a saved image path without establishing that the model interpreted the image correctly. I would test image selection, file reading, upload authentication, model input, and reloading the conversation as separate steps of the same flow.

## How it works

The user-facing journey in the reviewed code is:

1. Open HealthBot and sign in through Clerk.
2. Write a question on the dashboard. The app creates a conversation and navigates to its chat page.
3. Read the model’s answer as it streams into the interface.
4. Ask a follow-up, optionally attaching an image. The client sends the stored text history and current message to Gemini.
5. Return to a saved conversation through the sidebar. Express retrieves the stored history from MongoDB.

```flow
# Architecture reconstructed from the March 12, 2025 repository snapshot
React client|routing, composer, streaming -> Clerk|sign-in and session
React client|model request and streamed answer -> Gemini API|direct browser call
React client|authenticated chat requests -> Express API|Node.js + Mongoose -> MongoDB|Chat and UserChats
React client|upload authentication -> Express /api/upload|signing parameters -> ImageKit|uploaded image and saved path
```

The diagram separates model generation from persistence. Image bytes also go from the client to Gemini as inline input; storing the file in ImageKit is a different operation.

![Historical HealthBot conversation view showing a user question, generated response, and follow-up composer.](/projects/healthbot/conversation-2025.png "Conversation screenshot supplied by Aayan Wasti to [Oakville News](https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011). Historical generated output, not medical advice.")

These are screenshots of the original HealthBot experience, not newly generated mockups. The conversation view captures how an answer appeared in the interface; its historical health-related output should not be treated as medical advice.

## Challenges

### Answers that stopped before they were finished

One problem I remember clearly is the AI stopping in the middle of an answer. Users noticed and complained. It sounds like a small issue until you think about the experience: someone asks a question, starts reading, and the reply simply ends before it makes its point. For a health-information assistant, that was especially frustrating. We had to treat it as a priority instead of moving straight to the next feature.

I do not remember the exact fix, and the code history does not clearly identify one. The streaming loop and accumulated-response ref are already present in the earliest retained commit. There is also a comment about a token setting, but not enough evidence to say it caused or resolved those complaints. I would rather leave that detail unresolved than invent a debugging story.

What I can explain is what I would investigate today. The saved version catches an error containing `SAFETY`, logs other stream errors, and saves accumulated text after the loop, but does not explicitly check the model's finish reason. I would want to distinguish a normal completion from a token limit, interrupted connection, blocked response, or failed save—and communicate that difference clearly in the interface.

### Images and a development URL that escaped into production

The feature reports early text-recognition and image-processing trouble, and credits Rahman with major bug fixes after we met at a hackathon. The repository does not establish a separate OCR service or the exact fix for each reported issue.

There is, however, a concrete image-upload change in [commit `6592545`, dated January 2, 2025](https://github.com/AayanWasti/Healthbot-official/commit/65925456ad03a5d18712ea2fb7aa673284a8d51e). Previously, the ImageKit authenticator always requested `http://localhost:3000/api/upload`. The change chooses `https://healthbot.ca/api/upload` in production and localhost in development. It also adds image-type checking and a file-read error handler.

A localhost URL in a deployed browser points to the visitor’s own machine. That explains why an upload-authentication path that works during local development needs a different address in production. This is a documented fix in the code history; it does not prove it was the cause of every image-processing problem.

### Shipping the whole flow

The March backend serves the built React files from Express and configures allowed frontend origins. Later, an August 2026 change separates the Express app from its listening server and exports it through a Vercel API entry. I keep that later hosting work separate from the 2024–2025 story.

Reading the March code also turns up a case I would test immediately. In `POST /api/chats`, the branch that creates a user’s first sidebar record saves it without sending the success response that the existing-user branch sends. I have not reproduced that in a running deployment; it is a first-use path I would include in an end-to-end check now.

The newspaper feature also describes how feedback influenced the interface, including a more conversational design, dark mode, and easier navigation. Those changes remind me that people judge a product by the whole experience, not just the model behind it.

## Getting featured in the news

On March 27, 2025, Oakville News published a feature about AIHealth and the students building HealthBot. Seeing our early project covered by a local newspaper was an encouraging milestone, especially knowing how much we still had to learn and improve. The article tells the story of the team and our goals; it is not a claim that the assistant was clinically validated.

:::press Featured in Oakville News
publication: Oakville News
headline: Local high school students create AI tool to make health information accessible
date: March 27, 2025
author: Ramona Leitao
description: A local profile of our student team, accessibility goals, and early product improvements.
url: https://www.oakvillenews.org/helpers/oakville-high-school-students-create-ai-tool-to-make-health-information-accessible-10397011
:::

## What I learned

The response-cutoff complaints changed how I thought about AI products. I learned that getting a model to generate text is only the beginning. If users cannot reliably get a complete response, it does not matter how impressive the demo looks.

That experience taught me to take feedback seriously and to prioritize reliability before piling on new features. Image uploads, streamed responses, and stored chats are separate pieces of code, but to a user they are one continuous experience. Today, I would test them together: signing in for the first time, attaching an image, recovering from an interrupted response, and opening an old conversation after a refresh.

Looking back at the model prompt, I also see decisions I would not repeat. It encourages too much certainty and discourages referral to a professional. I did not find a medical-source retrieval or citation-verification pipeline in the reviewed request path. For a health-related assistant, those gaps are too important to brush aside, regardless of the original intention.

I would also make completion and failure explicit in the interface, move model access behind the backend, and review how user information is retained. For health-related output, I would use language that acknowledges uncertainty, clearly explain the assistant’s limits, and work with qualified medical reviewers before making claims about clinical performance. Those are improvements I would pursue, not safeguards I can claim were already in place.

I started HealthBot independently, but I did not finish the journey alone. It became a team project, reached real users, and taught me that shipping software means taking responsibility for what happens after someone clicks “send.” That is the part I still carry into the products I build now.
